using System;
using System.ComponentModel.DataAnnotations;

namespace HospitalApi.DTOs
{
    public class AppointmentDto
    {
        [Required]
        public int PatientId { get; set; }

        [Required]
        public int DoctorId { get; set; }

        [Required]
        public DateTime AppointmentDate { get; set; }

        [Required]
        [MaxLength(20)]
        public string AppointmentTime { get; set; } = string.Empty; // e.g. "10:30 AM"

        [MaxLength(50)]
        public string Status { get; set; } = "Pending"; // Pending, Confirmed, Completed, Cancelled

        [MaxLength(250)]
        public string Reason { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Notes { get; set; } = string.Empty;
    }
}
