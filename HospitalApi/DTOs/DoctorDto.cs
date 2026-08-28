using System.ComponentModel.DataAnnotations;

namespace HospitalApi.DTOs
{
    public class DoctorDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Specialization { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Department { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Phone { get; set; } = string.Empty;

        public int ExperienceYears { get; set; }

        [Range(0, 1000000)]
        public decimal ConsultationFee { get; set; }

        [MaxLength(200)]
        public string AvailableDays { get; set; } = "Mon-Fri";
    }
}
