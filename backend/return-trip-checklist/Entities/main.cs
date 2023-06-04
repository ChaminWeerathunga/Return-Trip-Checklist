namespace return_trip_checklist.Entities
{
    public class main
    {
        public string WoNumber { get; set; }
        public string CustomerName { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime LastInstallDate { get; set; }
        public string ReasonForReturn { get; set; }
        public bool RequireNewProduct { get; set; }
        public string ItemDescription { get; set; }
        public bool PhotoDefectsComplete { get; set; }
        public bool CustomerSignedOff { get; set; }
        public bool GivenReturnDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public string? AdditionalInstructions { get; set; }
        public string? CompletionNotes { get; set; }
        public DateTime ProductOrderedDate { get; set; }
        public DateTime ExpectedArrivalDate { get; set; }
        public DateTime ArrangedReturnDate { get; set; }
        public bool AttachRemakeForm { get; set; }
        public bool ConfirmedArrivalDate { get; set; }
        public bool ProductInStock { get; set; }
        public string JobCompletedBy { get; set; }
        public DateTime JobCompletedDate { get; set; }
    }
}
