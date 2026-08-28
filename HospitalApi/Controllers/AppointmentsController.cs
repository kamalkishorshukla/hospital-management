using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalApi.Data;
using HospitalApi.DTOs;
using HospitalApi.Models;

namespace HospitalApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AppointmentsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/appointments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments([FromQuery] string? status, [FromQuery] DateTime? date)
        {
            var query = _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
            {
                var s = status.Trim().ToLower();
                query = query.Where(a => a.Status.ToLower() == s);
            }

            if (date.HasValue)
            {
                var targetDate = date.Value.Date;
                query = query.Where(a => a.AppointmentDate.Date == targetDate);
            }

            return await query.OrderByDescending(a => a.AppointmentDate).ThenByDescending(a => a.CreatedAt).ToListAsync();
        }

        // GET: api/appointments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetAppointment(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
            {
                return NotFound(new { message = $"Appointment with ID {id} not found." });
            }

            return appointment;
        }

        // POST: api/appointments
        [HttpPost]
        public async Task<ActionResult<Appointment>> CreateAppointment([FromBody] AppointmentDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Verify Patient exists
            var patientExists = await _context.Patients.AnyAsync(p => p.Id == dto.PatientId);
            if (!patientExists)
            {
                return BadRequest(new { message = "Selected patient does not exist." });
            }

            // Verify Doctor exists
            var doctorExists = await _context.Doctors.AnyAsync(d => d.Id == dto.DoctorId);
            if (!doctorExists)
            {
                return BadRequest(new { message = "Selected doctor does not exist." });
            }

            var appointment = new Appointment
            {
                PatientId = dto.PatientId,
                DoctorId = dto.DoctorId,
                AppointmentDate = dto.AppointmentDate,
                AppointmentTime = dto.AppointmentTime.Trim(),
                Status = string.IsNullOrWhiteSpace(dto.Status) ? "Pending" : dto.Status.Trim(),
                Reason = dto.Reason?.Trim() ?? string.Empty,
                Notes = dto.Notes?.Trim() ?? string.Empty,
                CreatedAt = DateTime.UtcNow
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            // Load navigation properties for response
            await _context.Entry(appointment).Reference(a => a.Patient).LoadAsync();
            await _context.Entry(appointment).Reference(a => a.Doctor).LoadAsync();

            return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, appointment);
        }

        // PUT: api/appointments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, [FromBody] AppointmentDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound(new { message = $"Appointment with ID {id} not found." });
            }

            // Verify Patient and Doctor exist if changed
            if (appointment.PatientId != dto.PatientId && !await _context.Patients.AnyAsync(p => p.Id == dto.PatientId))
            {
                return BadRequest(new { message = "Selected patient does not exist." });
            }

            if (appointment.DoctorId != dto.DoctorId && !await _context.Doctors.AnyAsync(d => d.Id == dto.DoctorId))
            {
                return BadRequest(new { message = "Selected doctor does not exist." });
            }

            appointment.PatientId = dto.PatientId;
            appointment.DoctorId = dto.DoctorId;
            appointment.AppointmentDate = dto.AppointmentDate;
            appointment.AppointmentTime = dto.AppointmentTime.Trim();
            appointment.Status = string.IsNullOrWhiteSpace(dto.Status) ? appointment.Status : dto.Status.Trim();
            appointment.Reason = dto.Reason?.Trim() ?? string.Empty;
            appointment.Notes = dto.Notes?.Trim() ?? string.Empty;

            await _context.SaveChangesAsync();

            await _context.Entry(appointment).Reference(a => a.Patient).LoadAsync();
            await _context.Entry(appointment).Reference(a => a.Doctor).LoadAsync();

            return Ok(appointment);
        }

        // PUT: api/appointments/5/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound(new { message = $"Appointment with ID {id} not found." });
            }

            appointment.Status = status.Trim();
            await _context.SaveChangesAsync();

            return Ok(new { message = "Status updated successfully.", status = appointment.Status });
        }

        // DELETE: api/appointments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound(new { message = $"Appointment with ID {id} not found." });
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment deleted successfully." });
        }

        // GET: api/appointments/dashboard-stats
        [HttpGet("dashboard-stats")]
        public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats()
        {
            var today = DateTime.UtcNow.Date;

            var totalDoctors = await _context.Doctors.CountAsync();
            var totalPatients = await _context.Patients.CountAsync();
            var totalAppointments = await _context.Appointments.CountAsync();
            
            var todayAppointments = await _context.Appointments
                .Where(a => a.AppointmentDate.Date == today)
                .CountAsync();

            var pendingAppointments = await _context.Appointments
                .Where(a => a.Status.ToLower() == "pending")
                .CountAsync();

            var completedAppointments = await _context.Appointments
                .Where(a => a.Status.ToLower() == "completed")
                .CountAsync();

            var recentAppointments = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .OrderByDescending(a => a.CreatedAt)
                .Take(5)
                .ToListAsync();

            var stats = new DashboardStatsDto
            {
                TotalDoctors = totalDoctors,
                TotalPatients = totalPatients,
                TotalAppointments = totalAppointments,
                TodayAppointments = todayAppointments,
                PendingAppointments = pendingAppointments,
                CompletedAppointments = completedAppointments,
                RecentAppointments = recentAppointments
            };

            return Ok(stats);
        }
    }
}
