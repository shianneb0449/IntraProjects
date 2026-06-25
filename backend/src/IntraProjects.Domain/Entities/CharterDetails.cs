namespace IntraProjects.Domain.Entities;

public class CharterTeamMember
{
    public int TeamMemberId { get; set; }
    public int CharterId { get; set; }
    public ProjectCharter Charter { get; set; } = null!;
    public string Name { get; set; } = string.Empty;
    public string? Role { get; set; }
    public decimal? EstimatedHours { get; set; }
    public int SortOrder { get; set; }
}

public class CharterMilestone
{
    public int MilestoneId { get; set; }
    public int CharterId { get; set; }
    public ProjectCharter Charter { get; set; } = null!;
    public int MilestoneNumber { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateOnly? CompleteByDate { get; set; }
    public bool IsComplete { get; set; } = false;
    public int SortOrder { get; set; }
}

public class CharterCostItem
{
    public int CostItemId { get; set; }
    public int CharterId { get; set; }
    public ProjectCharter Charter { get; set; } = null!;
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public int SortOrder { get; set; }
}

public class CharterVendorPro
{
    public int VendorProId { get; set; }
    public int CharterId { get; set; }
    public ProjectCharter Charter { get; set; } = null!;
    public string Text { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}

public class CharterVendorCon
{
    public int VendorConId { get; set; }
    public int CharterId { get; set; }
    public ProjectCharter Charter { get; set; } = null!;
    public string Text { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}

public class CharterVendorReference
{
    public int VendorReferenceId { get; set; }
    public int CharterId { get; set; }
    public ProjectCharter Charter { get; set; } = null!;
    public string Contact { get; set; } = string.Empty;
    public string? ContactInfo { get; set; }
    public int SortOrder { get; set; }
}
