# Return-Trip-Checklist

1. Create a React project and set up the environment.
2. Create a page with following information:
  2.1 Header name is "Return Trip Checklist"
  2.2 Section 1: Customer Info
      fields: 
        W/O# (text)
        Customer Name (text)
        Address (text)
        Phone Number (text)
        Last Install Date (Date)
        Reason for return trip (long text)
        Does this return trip require new product? (Yes/No)
        Item #'s & Description: (long text)
        Photo of defects required for remakes. Complete? (Yes/No)
        Has the customer signed off/paid for job? (Yes/No)
        Have you given then a return date? (Yes/No)
        if Yes, show a field called: Date (Date), otherwise hidden 'Date' field
  2.3 Section 2: Additional Information
    fields: 
      Additional Instructions for Installer (long text, nullable)
      Completion Notes if needed (long text, nullable)
  2.4 Section 3: Admin To Complete
  fields: 
    Product Ordered Date (Date)
    Expected Arrival Date (Date)
    Arranged Return Date (Date)
    Attach Remake Form (Yes/No)
    Confirmed Arrival Date (Yes/No)
    Product in Stock (Yes/No)
    Job Completed By (Dropdown selection)
    Job Completed Date (Date)
    
P.S.: All fields are required, unless it is marked as nullable

  2.5 Add 'Submit' button
  3. After Submit button clicked,
  3.1 Generate a pdf with all fields and formatting
  3.2 Send Email to VKhatri@centra.ca & mxu@centra.ca
      the Subject is "W/O# {W/O# value} - Return Trip Checklist"
      the body is 'All fields from the form'
      attachment is the PDF
