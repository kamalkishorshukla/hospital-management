using System.Collections.Generic;
using HospitalApi.Models;

namespace HospitalApi.DTOs
{
    public class DashboardStatsDto
    {
        public int TotalDoctors { get; set; }
        public int TotalPatients { get; set; }
        public int TotalAppointments { get; set; }
        public int TodayAppointments { get; set; }
        public int PendingAppointments { get; set; }
        public int CompletedAppointments { get; set; }
        public IEnumerable<Appointment> RecentAppointments { get; set; } = new List<Appointment>();
    }
}
