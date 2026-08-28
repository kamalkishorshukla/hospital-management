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
    public class DoctorsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DoctorsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/doctors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Doctor>>> GetDoctors([FromQuery] string? search)
        {
            var query = _context.Doctors.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim().ToLower();
                query = query.Where(d => d.Name.ToLower().Contains(s) ||
                                         d.Specialization.ToLower().Contains(s) ||
                                         d.Department.ToLower().Contains(s));
            }

            return await query.OrderByDescending(d => d.CreatedAt).ToListAsync();
        }

        // GET: api/doctors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Doctor>> GetDoctor(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);

            if (doctor == null)
            {
                return NotFound(new { message = $"Doctor with ID {id} not found." });
            }

            return doctor;
        }

        // POST: api/doctors
        [HttpPost]
        public async Task<ActionResult<Doctor>> CreateDoctor([FromBody] DoctorDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var doctor = new Doctor
            {
                Name = dto.Name.Trim(),
                Specialization = dto.Specialization.Trim(),
                Department = dto.Department.Trim(),
                Email = dto.Email.Trim().ToLower(),
                Phone = dto.Phone.Trim(),
                ExperienceYears = dto.ExperienceYears,
                ConsultationFee = dto.ConsultationFee,
                AvailableDays = string.IsNullOrWhiteSpace(dto.AvailableDays) ? "Mon-Fri" : dto.AvailableDays.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDoctor), new { id = doctor.Id }, doctor);
        }

        // PUT: api/doctors/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDoctor(int id, [FromBody] DoctorDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
            {
                return NotFound(new { message = $"Doctor with ID {id} not found." });
            }

            doctor.Name = dto.Name.Trim();
            doctor.Specialization = dto.Specialization.Trim();
            doctor.Department = dto.Department.Trim();
            doctor.Email = dto.Email.Trim().ToLower();
            doctor.Phone = dto.Phone.Trim();
            doctor.ExperienceYears = dto.ExperienceYears;
            doctor.ConsultationFee = dto.ConsultationFee;
            doctor.AvailableDays = string.IsNullOrWhiteSpace(dto.AvailableDays) ? "Mon-Fri" : dto.AvailableDays.Trim();

            await _context.SaveChangesAsync();

            return Ok(doctor);
        }

        // DELETE: api/doctors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
            {
                return NotFound(new { message = $"Doctor with ID {id} not found." });
            }

            // Check if doctor has associated appointments
            var hasAppointments = await _context.Appointments.AnyAsync(a => a.DoctorId == id);
            if (hasAppointments)
            {
                return BadRequest(new { message = "Cannot delete doctor because there are appointments linked with this doctor." });
            }

            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Doctor deleted successfully." });
        }
    }
}
