using System.ComponentModel.DataAnnotations;

namespace HospitalApi.DTOs
{
    public class PatientDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Range(0, 150)]
        public int Age { get; set; }

        [Required]
        [MaxLength(20)]
        public string Gender { get; set; } = string.Empty; // Male, Female, Other

        [Required]
        [MaxLength(20)]
        public string Phone { get; set; } = string.Empty;

        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(250)]
        public string Address { get; set; } = string.Empty;

        [MaxLength(10)]
        public string BloodGroup { get; set; } = string.Empty; // A+, O+, etc.

        [MaxLength(500)]
        public string MedicalHistory { get; set; } = string.Empty;
    }
}
