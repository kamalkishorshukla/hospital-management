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
    public class PatientsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PatientsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/patients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatients([FromQuery] string? search)
        {
            var query = _context.Patients.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim().ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(s) ||
                                         p.Phone.ToLower().Contains(s) ||
                                         p.Email.ToLower().Contains(s) ||
                                         p.BloodGroup.ToLower().Contains(s));
            }

            return await query.OrderByDescending(p => p.CreatedAt).ToListAsync();
        }

        // GET: api/patients/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Patient>> GetPatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);

            if (patient == null)
            {
                return NotFound(new { message = $"Patient with ID {id} not found." });
            }

            return patient;
        }

        // POST: api/patients
        [HttpPost]
        public async Task<ActionResult<Patient>> CreatePatient([FromBody] PatientDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var patient = new Patient
            {
                Name = dto.Name.Trim(),
                Age = dto.Age,
                Gender = dto.Gender.Trim(),
                Phone = dto.Phone.Trim(),
                Email = dto.Email.Trim().ToLower(),
                Address = dto.Address.Trim(),
                BloodGroup = dto.BloodGroup.Trim().ToUpper(),
                MedicalHistory = dto.MedicalHistory.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPatient), new { id = patient.Id }, patient);
        }

        // PUT: api/patients/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] PatientDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
            {
                return NotFound(new { message = $"Patient with ID {id} not found." });
            }

            patient.Name = dto.Name.Trim();
            patient.Age = dto.Age;
            patient.Gender = dto.Gender.Trim();
            patient.Phone = dto.Phone.Trim();
            patient.Email = dto.Email.Trim().ToLower();
            patient.Address = dto.Address.Trim();
            patient.BloodGroup = dto.BloodGroup.Trim().ToUpper();
            patient.MedicalHistory = dto.MedicalHistory.Trim();

            await _context.SaveChangesAsync();

            return Ok(patient);
        }

        // DELETE: api/patients/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
            {
                return NotFound(new { message = $"Patient with ID {id} not found." });
            }

            // Check if patient has associated appointments
            var hasAppointments = await _context.Appointments.AnyAsync(a => a.PatientId == id);
            if (hasAppointments)
            {
                return BadRequest(new { message = "Cannot delete patient because there are appointments linked with this patient." });
            }

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Patient deleted successfully." });
        }
    }
}
