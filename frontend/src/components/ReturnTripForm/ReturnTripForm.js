import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import PhoneInput from "react-phone-input-2";
import "./ReturnTripForm.css";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/datepicker.css";
import "react-phone-input-2/lib/style.css";
import axios from "axios";

const ReturnTripForm = () => {
    const initialFormData = {
        woNumber: "",
        customerName: "",
        address: "",
        phoneNumber: "",
        lastInstallDate: null,
        reasonForReturn: "",
        requireNewProduct: false,
        itemDescription: "",
        photoDefectsComplete: false,
        customerSignedOff: false,
        givenReturnDate: false,
        returnDate: null,
        additionalInstructions: "",
        completionNotes: "",
        productOrderedDate: null,
        expectedArrivalDate: null,
        arrangedReturnDate: null,
        attachRemakeForm: false,
        confirmedArrivalDate: false,
        productInStock: false,
        jobCompletedBy: "",
        jobCompletedDate: null
    };

    const initialFieldValidity = Object.keys(initialFormData).reduce(
        (acc, fieldName) => {
            return { ...acc, [fieldName]: true };
        },
        {}
    );

    const [formData, setFormData] = useState(initialFormData);
    const [fieldValidity, setFieldValidity] = useState(initialFieldValidity);
    const [fieldTouched, setFieldTouched] = useState(false);

    const validateField = (fieldName) => {
        const fieldValue = formData[fieldName];
        let isValid = true;

        if (fieldValue instanceof Date) {
            isValid = !isNaN(fieldValue.getTime());
        } else if (typeof fieldValue === "string") {
            isValid = fieldValue.trim() !== "";
        } else {
            isValid = false;
        }

        setFieldValidity((prevState) => ({
            ...prevState,
            [fieldName]: isValid,
        }));
    };

    useEffect(() => {
        debugger
        for (const field in formData) {
            if (formData[field] !== null && formData[field].length > 0) {
                validateField(field);
            }
        }
    }, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let formIsValid = true;

        for (const field in fieldValidity) {
            if (!fieldValidity[field]) {
                formIsValid = false;
                break;
            }
        }

        if (formIsValid && ((formData.givenReturnDate && formData.returnDate !== null) || (!formData.givenReturnDate && formData.returnDate === null))) {
            try {
                const response = await axios.post(
                    "https://localhost:7021/api/form",
                    formData
                );
                console.log(response.data);

                //setFormData(initialFormData);
            } catch (error) {
                console.error(error);
            }
        } else {
            setFieldValidity((prevState) => {
                const updatedValidity = { ...prevState };
                for (const field in updatedValidity) {
                    if (!updatedValidity[field]) {
                        updatedValidity[field] = false;
                    }
                }
                return updatedValidity;
            });
        }
    };

    const jobCompletedByOptions = [
        { id: "1", label: "Option 1" },
        { id: "2", label: "Option 2" },
        { id: "3", label: "Option 3" },
    ];

    return (
        <div className="container">
            <h1 className="mt-3">
                <b>Return Trip Checklist</b>
            </h1>

            <form onSubmit={handleSubmit} className="mb-4">
                <section>
                    <h3>Customer Info</h3>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label>W/O#</label>
                            <input
                                type="text"
                                placeholder="W/O#"
                                className={`form-control ${fieldValidity.woNumber ? "" : "is-invalid"}`}
                                value={formData.woNumber}
                                onChange={(e) => {
                                    setFormData((prevState) => ({
                                        ...prevState,
                                        woNumber: e.target.value,
                                    }));
                                    setFieldTouched(true);
                                }}
                                onBlur={() => validateField("woNumber")}
                                required
                            />
                            {((!fieldValidity.woNumber && fieldTouched) && (
                                <span>Please enter a work order number.</span>
                            )) ||
                                (!fieldValidity.woNumber && (
                                    <span>Please enter a work order number.</span>
                                ))
                            }
                        </div>
                        <div className="form-group col-md-6">
                            <label>Customer Name</label>
                            <input
                                type="text"
                                name="customerName"
                                placeholder="Customer Name"
                                className={`form-control ${!fieldValidity.customerName ? "is-invalid" : ""}`}
                                value={formData.customerName}
                                onChange={(e) => {
                                    setFormData((prevState) => ({
                                        ...prevState,
                                        customerName: e.target.value,
                                    }));
                                    setFieldTouched(true);
                                }}
                                onBlur={() => {
                                    validateField("customerName");
                                }}
                                required
                            />
                            {((!fieldValidity.customerName && fieldTouched) && (
                                <span>Please enter a customer name.</span>
                            )) ||
                                (!fieldValidity.customerName && (
                                    <span>Please enter a customer name.</span>
                                ))
                            }
                        </div>
                        <div className="form-group col-md-6">
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                placeholder="Address"
                                className={`form-control ${!fieldValidity.address ? "is-invalid" : ""}`}
                                value={formData.address}
                                onChange={(e) => {
                                    setFormData((prevState) => ({
                                        ...prevState,
                                        address: e.target.value,
                                    }));
                                    setFieldTouched(true);
                                }}
                                onBlur={() => {
                                    validateField("address");
                                }}
                                required
                            />
                            {((!fieldValidity.address && fieldTouched) && (
                                <span>Please enter a address.</span>
                            )) ||
                                (!fieldValidity.address && (
                                    <span>Please enter a address.</span>
                                ))
                            }
                        </div>
                        <div className="form-group col-md-6">
                            <label>Phone Number</label>
                            <PhoneInput
                                name="phoneNumber"
                                country={"ca"}
                                value={formData.phoneNumber}
                                className={`${!fieldValidity.phoneNumber ? "is-invalid" : ""}`}
                                onChange={(value) => {
                                    setFormData({ ...formData, phoneNumber: value });
                                    if (value.length > 0) {
                                        validateField("phoneNumber");
                                    }
                                }}
                                onBlur={() => {
                                    validateField("phoneNumber");
                                }}
                                required
                            />
                            {((!fieldValidity.phoneNumber && fieldTouched) && (
                                <span>Please enter a phone number.</span>
                            )) ||
                                (!fieldValidity.phoneNumber && (
                                    <span>Please enter a phone number.</span>
                                ))
                            }
                        </div>
                        <div className="form-group col-md-6">
                            <label>Last Install Date</label>
                            <DatePicker
                                name="lastInstallDate"
                                selected={formData.lastInstallDate}
                                className={`form-control ${!fieldValidity.lastInstallDate ? "is-invalid" : ""}`}
                                onDayMouseEnter={(date) => {
                                    setFormData((prevState) => ({
                                        ...prevState,
                                        lastInstallDate: date,
                                    }));
                                    setFieldTouched(true);
                                }}
                                onBlur={() => {
                                    validateField("lastInstallDate");
                                }}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Please select a date"
                                required
                            />
                            {((!fieldValidity.lastInstallDate && fieldTouched) && (
                                <span>Please select a last install date.</span>
                            )) ||
                                (!fieldValidity.lastInstallDate && (
                                    <span>Please select a last install date.</span>
                                ))
                            }
                        </div>
                        <div className="form-group col-md-6">
                            <label>Does this return trip require a new product?</label>
                            <div>
                                <label htmlFor="requireNewProductYes" className="radio-label">
                                    <input
                                        type="radio"
                                        id="requireNewProductYes"
                                        name="requireNewProductYes"
                                        value={true}
                                        checked={formData.requireNewProduct === true}
                                        onChange={(e) => {
                                            setFormData({ ...formData, requireNewProduct: e.target.value === "true" });
                                        }}
                                    />
                                    Yes
                                </label>
                                <label htmlFor="requireNewProductNo" className="radio-label">
                                    <input
                                        type="radio"
                                        id="requireNewProductNo"
                                        name="requireNewProductNo"
                                        value={false}
                                        checked={formData.requireNewProduct === false}
                                        onChange={(e) => {
                                            setFormData({ ...formData, requireNewProduct: e.target.value === "true" });
                                        }}
                                    />
                                    No
                                </label>
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label>Reason for Return Trip</label>
                            <textarea
                                className={`form-control ${!fieldValidity.reasonForReturn ? "is-invalid" : ""}`}
                                value={formData.reasonForReturn}
                                onChange={(e) => {
                                    setFormData((prevState) => ({
                                        ...prevState,
                                        reasonForReturn: e.target.value,
                                    }));
                                    setFieldTouched(true);
                                }}
                                onBlur={() => {
                                    validateField("reasonForReturn");
                                }}
                                rows={4}
                                placeholder="Reason for Return Trip"
                                required
                            ></textarea>
                            {((!fieldValidity.reasonForReturn && fieldTouched) && (
                                <span>Please enter a reason for return.</span>
                            )) ||
                                (!fieldValidity.reasonForReturn && (
                                    <span>Please enter a reasonF for return.</span>
                                ))
                            }
                        </div>
                        <div className="form-group col-md-6">
                            <label>Item #'s & Description</label>
                            <textarea
                                className={`form-control ${!fieldValidity.itemDescription ? "is-invalid" : ""}`}
                                value={formData.itemDescription}
                                onChange={(e) => {
                                    setFormData((prevState) => ({
                                        ...prevState,
                                        itemDescription: e.target.value,
                                    }));
                                    setFieldTouched(true);
                                }}
                                onBlur={() => {
                                    validateField("itemDescription");
                                }}
                                rows={4}
                                placeholder="Item #'s & Description"
                                required
                            ></textarea>
                            {((!fieldValidity.itemDescription && fieldTouched) && (
                                <span>Please enter a item #'s & description.</span>
                            )) ||
                                (!fieldValidity.itemDescription && (
                                    <span>Please enter a item #'s & description.</span>
                                ))
                            }
                        </div>
                        <div className="form-group col-md-6">
                            <label>Photo of defects required for remakes. Complete?</label>
                            <div>
                                <label htmlFor="photoDefectsCompleteYes" className="radio-label">
                                    <input
                                        type="radio"
                                        id="photoDefectsCompleteYes"
                                        name="photoDefectsCompleteYes"
                                        value={true}
                                        checked={formData.photoDefectsComplete === true}
                                        onChange={(e) => {
                                            setFormData({ ...formData, photoDefectsComplete: e.target.value === "true" });
                                        }}
                                    />
                                    Yes
                                </label>
                                <label htmlFor="photoDefectsCompleteNo" className="radio-label">
                                    <input
                                        type="radio"
                                        id="photoDefectsCompleteNo"
                                        name="photoDefectsCompleteNo"
                                        value={false}
                                        checked={formData.photoDefectsComplete === false}
                                        onChange={(e) => {
                                            setFormData({ ...formData, photoDefectsComplete: e.target.value === "true" });
                                        }}
                                    />
                                    No
                                </label>
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label>Has the customer signed off/paid for job?</label>
                            <div>
                                <label htmlFor="customerSignedOffYes" className="radio-label">
                                    <input
                                        type="radio"
                                        id="customerSignedOffYes"
                                        name="customerSignedOffYes"
                                        value={true}
                                        checked={formData.customerSignedOff === true}
                                        onChange={(e) => {
                                            setFormData({ ...formData, customerSignedOff: e.target.value === "true" });
                                        }}
                                    />
                                    Yes
                                </label>
                                <label htmlFor="customerSignedOffNo" className="radio-label">
                                    <input
                                        type="radio"
                                        id="customerSignedOffNo"
                                        name="customerSignedOffNo"
                                        value={false}
                                        checked={formData.customerSignedOff === false}
                                        onChange={(e) => {
                                            setFormData({ ...formData, customerSignedOff: e.target.value === "true" });
                                        }}
                                    />
                                    No
                                </label>
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label>Have you given them a return date?</label>
                            <div>
                                <label htmlFor="givenReturnDateYes" className="radio-label">
                                    <input
                                        type="radio"
                                        id="givenReturnDateYes"
                                        name="givenReturnDateYes"
                                        value={true}
                                        checked={formData.givenReturnDate === true}
                                        onChange={(e) => {
                                            setFormData({ ...formData, givenReturnDate: e.target.value === "true" });
                                        }}
                                    />
                                    Yes
                                </label>
                                <label htmlFor="givenReturnDateNo" className="radio-label">
                                    <input
                                        type="radio"
                                        id="givenReturnDateNo"
                                        name="givenReturnDateNo"
                                        value={false}
                                        checked={formData.givenReturnDate === false}
                                        onChange={(e) => {
                                            setFormData({ ...formData, 
                                            givenReturnDate: e.target.value === "true",
                                            returnDate: null });
                                        }}
                                    />
                                    No
                                </label>
                            </div>
                        </div>
                        {formData.givenReturnDate && (
                            <div className="form-group col-md-6">
                                <label>Return Date</label>
                                <DatePicker
                                    selected={formData.returnDate}
                                    onChange={(date) =>
                                        setFormData((prevState) => ({
                                            ...prevState,
                                            returnDate: date,
                                        }))
                                    }
                                    onBlur={() => validateField("returnDate")}
                                    className={`form-control ${fieldValidity.returnDate ? "" : "is-invalid"
                                        }`}
                                    placeholderText="Select return date"
                                />
                            </div>
                        )}
                    </div>
                </section>

                <section>
                    <h3>Additional Information</h3>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label>Additional Instructions for Installer</label>
                            <textarea
                                className="form-control"
                                value={formData.additionalInstructions}
                                onChange={(e) => {
                                    setFormData({ ...formData, additionalInstructions: e.target.value });
                                }}
                                rows={4}
                                placeholder="Additional Instructions"
                            ></textarea>
                        </div>
                        <div className="form-group col-md-6">
                            <label>Completion Notes if needed</label>
                            <textarea
                                className="form-control"
                                value={formData.completionNotes}
                                onChange={(e) => {
                                    setFormData({ ...formData, completionNotes: e.target.value });
                                }}
                                rows={4}
                                placeholder="Completion Notes"
                            ></textarea>
                        </div>
                    </div>
                </section>

                <section>
                    <h3>Admin To Complete</h3>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label>Product Ordered Date</label>
                            <DatePicker
                                name="productOrderedDate"
                                selected={formData.productOrderedDate}
                                className={`form-control ${!fieldValidity.productOrderedDate ? "is-invalid" : ""}`}
                                onDayMouseEnter={(date) => {
                                    setFormData((prevState) => ({
                                        ...prevState,
                                        productOrderedDate: date,
                                    }));
                                    setFieldTouched(true);
                                }}
                                onBlur={() => {
                                    validateField("productOrderedDate");
                                }}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Please select a date"
                                required
                            />
                            {((!fieldValidity.productOrderedDate && fieldTouched) && (
                                <span>Please select a product ordered date.</span>
                            )) ||
                                (!fieldValidity.productOrderedDate && (
                                    <span>Please select a product ordered date.</span>
                                ))
                            }
                        </div>
                        <div className="form-group col-md-6">
                            <label>Expected Arrival Date</label>
                            <DatePicker
                                name="expectedArrivalDate"
                                selected={formData.expectedArrivalDate}
                                className={`form-control ${!fieldValidity.expectedArrivalDate ? "is-invalid" : ""}`}
                                onDayMouseEnter={(date) => {
                                    setFormData((prevState) => ({
                                        ...prevState,
                                        expectedArrivalDate: date,
                                    }));
                                    setFieldTouched(true);
                                }}
                                onBlur={() => {
                                    validateField("expectedArrivalDate");
                                }}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Please select a date"
                                required
                            />
                            {((!fieldValidity.expectedArrivalDate && fieldTouched) && (
                                <span>Please select a expected arrival date.</span>
                            )) ||
                                (!fieldValidity.expectedArrivalDate && (
                                    <span>Please select a expected arrival date.</span>
                                ))
                            }
                        </div>
                        <div className="form-group col-md-6">
                            <label>Arranged Return Date</label>
                            <DatePicker
                                name="arrangedReturnDate"
                                selected={formData.arrangedReturnDate}
                                className={`form-control ${!fieldValidity.arrangedReturnDate ? "is-invalid" : ""}`}
                                onDayMouseEnter={(date) => {
                                    setFormData((prevState) => ({
                                        ...prevState,
                                        arrangedReturnDate: date,
                                    }));
                                    setFieldTouched(true);
                                }}
                                onBlur={() => {
                                    validateField("arrangedReturnDate");
                                }}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Please select a date"
                                required
                            />
                            {((!fieldValidity.arrangedReturnDate && fieldTouched) && (
                                <span>Please select a arranged return date.</span>
                            )) ||
                                (!fieldValidity.arrangedReturnDate && (
                                    <span>Please select a arranged return date.</span>
                                ))
                            }
                        </div>
                        <div className="form-group col-md-6">
                            <label>Attach Remake Form</label>
                            <div>
                                <label htmlFor="attachRemakeFormYes" className="radio-label">
                                    <input
                                        type="radio"
                                        id="attachRemakeFormYes"
                                        name="attachRemakeFormYes"
                                        value={true}
                                        checked={formData.attachRemakeForm === true}
                                        onChange={(e) => {
                                            setFormData({ ...formData, attachRemakeForm: e.target.value === "true" });
                                        }}
                                    />
                                    Yes
                                </label>
                                <label htmlFor="attachRemakeFormNo" className="radio-label">
                                    <input
                                        type="radio"
                                        id="attachRemakeFormNo"
                                        name="attachRemakeFormNo"
                                        value={false}
                                        checked={formData.attachRemakeForm === false}
                                        onChange={(e) => {
                                            setFormData({ ...formData, attachRemakeForm: e.target.value === "true" });
                                        }}
                                    />
                                    No
                                </label>
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label>Confirmed Arrival Date</label>
                            <div>
                                <label htmlFor="confirmedArrivalDateYes" className="radio-label">
                                    <input
                                        type="radio"
                                        id="confirmedArrivalDateYes"
                                        name="confirmedArrivalDateYes"
                                        value={true}
                                        checked={formData.confirmedArrivalDate === true}
                                        onChange={(e) => {
                                            setFormData({ ...formData, confirmedArrivalDate: e.target.value === "true" });
                                        }}
                                    />
                                    Yes
                                </label>
                                <label htmlFor="confirmedArrivalDateNo" className="radio-label">
                                    <input
                                        type="radio"
                                        id="confirmedArrivalDateNo"
                                        name="confirmedArrivalDateNo"
                                        value={false}
                                        checked={formData.confirmedArrivalDate === false}
                                        onChange={(e) => {
                                            setFormData({ ...formData, confirmedArrivalDate: e.target.value === "true" });
                                        }}
                                    />
                                    No
                                </label>
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label>Product in Stock</label>
                            <div>
                                <label htmlFor="productInStockYes" className="radio-label">
                                    <input
                                        type="radio"
                                        id="productInStockYes"
                                        name="productInStockYes"
                                        value={true}
                                        checked={formData.productInStock === true}
                                        onChange={(e) => {
                                            setFormData({ ...formData, productInStock: e.target.value === "true" });
                                        }}
                                    />
                                    Yes
                                </label>
                                <label htmlFor="productInStockNo" className="radio-label">
                                    <input
                                        type="radio"
                                        id="productInStockNo"
                                        name="productInStockNo"
                                        value={false}
                                        checked={formData.productInStock === false}
                                        onChange={(e) => {
                                            setFormData({ ...formData, productInStock: e.target.value === "true" });
                                        }}
                                    />
                                    No
                                </label>
                            </div>
                        </div>
                        <div className={`form-group col-md-6 ${!fieldValidity.jobCompletedBy ? "has-error" : ""}`}>
                            <label>Job Completed By</label>
                            <select
                                className={`form-control ${!fieldValidity.jobCompletedBy ? "is-invalid" : ""}`}
                                value={formData.jobCompletedBy}
                                onChange={(e) => {
                                    setFormData((prevState) => ({
                                        ...prevState,
                                        jobCompletedBy: e.target.value,
                                    }));
                                    setFieldTouched(true);
                                }}
                                onBlur={() => {
                                    validateField("jobCompletedBy");
                                }}
                                required
                            >
                                <option value="">Please select an option</option>
                                {jobCompletedByOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {((!fieldValidity.jobCompletedBy && fieldTouched) && (
                                <span>Please select a job completed by.</span>
                            )) ||
                                (!fieldValidity.jobCompletedBy && (
                                    <span>Please select a job completed by.</span>
                                ))
                            }
                        </div>
                        <div className="form-group col-md-6">
                            <label>Job Completed Date</label>
                            <DatePicker
                                name="jobCompletedDate"
                                selected={formData.jobCompletedDate}
                                className={`form-control ${!fieldValidity.jobCompletedDate ? "is-invalid" : ""}`}
                                onDayMouseEnter={(date) => {
                                    setFormData((prevState) => ({
                                        ...prevState,
                                        jobCompletedDate: date,
                                    }));
                                    setFieldTouched(true);
                                }}
                                onBlur={() => {
                                    validateField("jobCompletedDate");
                                }}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Please select a date"
                                required
                            />
                            {((!fieldValidity.jobCompletedDate && fieldTouched) && (
                                <span>Please select a job completed date.</span>
                            )) ||
                                (!fieldValidity.jobCompletedDate && (
                                    <span>Please select a job completed date.</span>
                                ))
                            }
                        </div>
                    </div>
                </section>
                <button type="submit" className="btn btn-primary mt-3">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ReturnTripForm;
