import React, { useState, useRef } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import Select from "react-select";
import {
  iranCities,
  iransodoor,
  grades,
  majors,
  alefOptions,
} from "./constants";
function MainOfMyPage() {
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [formDisabled, setFormDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [xOffset, setXOffset] = useState(0);

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [imageError, setImageError] = useState("");

  const fileInputRef = useRef();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthDateObj, setBirthDateObj] = useState(null);
  const [birthPlace, setBirthPlace] = useState(null);
  const [iranSodoor, setIranSodoor] = useState(null);
  const [grade, setGrade] = useState(grades[0]);
  const [major, setMajor] = useState(null);
  const [serialAlpha, setSerialAlpha] = useState(null);
  const [serialNumber, setSerialNumber] = useState("");
  const [serialNumber2, setSerialNumber2] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [homeNumber, setHomeNumber] = useState("");
  const [yOffset, setYOffset] = useState(0);

  const [parentFirstName, setParentFirstName] = useState("");
  const [parentLastName, setParentLastName] = useState("");
  const [parentJob, setParentJob] = useState("");
  const [parentContact, setParentContact] = useState("");
  const [parentNationalCode, setParentNationalCode] = useState("");
  const [parentEducation, setParentEducation] = useState("");
  const [parentWorkAddress, setParentWorkAddress] = useState("");
  const [parentErrors, setParentErrors] = useState({});

  const [motherFirstName, setMotherFirstName] = useState("");
  const [motherLastName, setMotherLastName] = useState("");
  const [motherJob, setMotherJob] = useState("");
  const [motherContact, setMotherContact] = useState("");
  const [motherNationalCode, setMotherNationalCode] = useState("");
  const [motherEducation, setMotherEducation] = useState("");
  const [motherWorkAddress, setMotherWorkAddress] = useState("");
  const [motherErrors, setMotherErrors] = useState({});

  const [prevSchool, setPrevSchool] = useState("");
  const [prevSchoolError, setPrevSchoolError] = useState("");
  const [prevAvg, setPrevAvg] = useState("");
  const [prevAvgError, setPrevAvgError] = useState("");
  const [prevDiscipline, setPrevDiscipline] = useState("");
  const [prevDisciplineError, setPrevDisciplineError] = useState("");

  const [errors, setErrors] = useState({});
  const [acceptFee, setAcceptFee] = useState(false);
  const [acceptFeeError, setAcceptFeeError] = useState("");
  const [reportCardRequiredError, setReportCardRequiredError] = useState("");

  const refs = {
    firstName: useRef(null),
    lastName: useRef(null),
    fatherName: useRef(null),
    nationalCode: useRef(null),
    birthDate: useRef(null),
    birthPlace: useRef(null),
    grade: useRef(null),
    major: useRef(null),
    serialAlpha: useRef(null),
    serialNumber: useRef(null),
    serialNumber2: useRef(null),
    contactNumber: useRef(null),
    homeNumber: useRef(null),
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    if (e.target.value.trim() !== "") setAddressError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("لطفا فقط فایل عکس انتخاب کنید.");
      setImageFile(null);
      setImageUrl(null);
      return;
    }

    if (file.size > 150 * 1024) {
      setImageError("حجم عکس باید کمتر از ۱۵۰ کیلوبایت باشد.");
      setImageFile(null);
      setImageUrl(null);
      return;
    }

    setImageError("");
    setImageFile(file);

    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageUrl(null);
    setZoom(1);
    fileInputRef.current.value = null;
  };

  const [reportCardFile, setReportCardFile] = useState(null);
  const [reportCardUrl, setReportCardUrl] = useState(null);
  const [reportCardError, setReportCardError] = useState("");
  const reportCardInputRef = useRef();
  const [reportCardZoom, setReportCardZoom] = useState(1);
  const [reportCardXOffset, setReportCardXOffset] = useState(0);
  const [reportCardYOffset, setReportCardYOffset] = useState(0);

  const handleReportCardChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setReportCardError("لطفا فقط فایل عکس انتخاب کنید.");
      setReportCardFile(null);
      setReportCardUrl(null);
      return;
    }

    if (file.size > 150 * 1024) {
      setReportCardError("حجم عکس باید کمتر از ۱۵۰ کیلوبایت باشد.");
      setReportCardFile(null);
      setReportCardUrl(null);
      return;
    }

    setReportCardError("");
    setReportCardFile(file);
    const url = URL.createObjectURL(file);
    setReportCardUrl(url);
  };

  const handleRemoveReportCard = () => {
    setReportCardFile(null);
    setReportCardUrl(null);
    setReportCardZoom(1);
    setReportCardXOffset(0);
    setReportCardYOffset(0);
    reportCardInputRef.current.value = null;
  };

  const handlePersianInput = (setter) => (e) => {
    const value = e.target.value;
    const regex = /^[\u0600-\u06FF\s]*$/;
    if (regex.test(value) || value === "") setter(value);
  };

  const handleNumberInput =
    (setter, maxLength = null) =>
    (e) => {
      let value = e.target.value;
      value = value.replace(/[^0-9]/g, ""); // فقط عدد باشه
      if (maxLength) value = value.slice(0, maxLength);
      setter(value);
    };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};
    let parentErr = {};
    let motherErr = {};
    let valid = true;

    if (!firstName) {
      newErrors.firstName = "نام را وارد کنید";
      valid = false;
    }
    if (!lastName) {
      newErrors.lastName = "نام خانوادگی را وارد کنید";
      valid = false;
    }
    if (!fatherName) {
      newErrors.fatherName = "نام پدر را وارد کنید";
      valid = false;
    }
    if (!nationalCode) {
      newErrors.nationalCode = "شماره ملی را وارد کنید";
      valid = false;
    } else if (nationalCode.length !== 10) {
      newErrors.nationalCode = "شماره ملی باید ۱۰ رقم باشد";
      valid = false;
    }
    if (!birthDate) {
      newErrors.birthDate = "تاریخ تولد را وارد کنید";
      valid = false;
    }
    if (!birthPlace) {
      newErrors.birthPlace = "محل تولد را انتخاب کنید";
      valid = false;
    }
    if (!grade) {
      newErrors.grade = "پایه تحصیلی را انتخاب کنید";
      valid = false;
    }
    if (!major) {
      newErrors.major = "رشته تحصیلی را انتخاب کنید";
      valid = false;
    }
    if (!serialAlpha) {
      newErrors.serialAlpha = "حرف الف سریال را انتخاب کنید";
      valid = false;
    }
    if (!serialNumber) {
      newErrors.serialNumber = "بخش اول سریال شناسنامه را وارد کنید";
      valid = false;
    } else if (serialNumber.length !== 2) {
      newErrors.serialNumber = "بخش اول سریال باید ۲ رقم باشد";
      valid = false;
    }
    if (!serialNumber2) {
      newErrors.serialNumber2 = "بخش دوم سریال شناسنامه را وارد کنید";
      valid = false;
    } else if (serialNumber2.length !== 3) {
      newErrors.serialNumber2 = "بخش دوم سریال باید ۳ رقم باشد";
      valid = false;
    }
    if (!contactNumber) {
      newErrors.contactNumber = "شماره تماس را وارد کنید";
      valid = false;
    } else if (contactNumber.length !== 11) {
      newErrors.contactNumber = "شماره تماس باید ۱۱ رقم باشد";
      valid = false;
    }
    if (!homeNumber) {
      newErrors.homeNumber = "شماره منزل را وارد کنید";
      valid = false;
    } else if (homeNumber.length !== 11) {
      newErrors.homeNumber = "شماره منزل باید ۱۱ رقم باشد";
      valid = false;
    }
    if (address.trim() === "") {
      setAddressError("وارد کردن آدرس الزامی است.");
      valid = false;
    } else {
      setAddressError("");
    }
    if (!imageFile) {
      setImageError("آپلود عکس الزامی است.");
      valid = false;
    } else {
      setImageError("");
    }

    if (!parentFirstName) parentErr.parentFirstName = "نام پدر را وارد کنید";
    if (!parentLastName) parentErr.parentLastName = "نام خانوادگی را وارد کنید";
    if (!parentJob) parentErr.parentJob = "شغل را وارد کنید";
    if (!parentContact) parentErr.parentContact = "شماره تماس را وارد کنید";
    else if (parentContact.length !== 11)
      parentErr.parentContact = "شماره تماس باید ۱۱ رقم باشد";
    if (!parentNationalCode)
      parentErr.parentNationalCode = "کد ملی پدر را وارد کنید";
    if (!parentEducation) parentErr.parentEducation = "تحصیلات را وارد کنید";
    if (!parentWorkAddress)
      parentErr.parentWorkAddress = "آدرس محل کار را وارد کنید";
    setParentErrors(parentErr);

    if (!motherFirstName) motherErr.motherFirstName = "نام مادر را وارد کنید";
    if (!motherLastName)
      motherErr.motherLastName = "نام خانوادگی مادر را وارد کنید";
    if (!motherJob) motherErr.motherJob = "شغل مادر را وارد کنید";
    if (!motherContact)
      motherErr.motherContact = "شماره تماس مادر را وارد کنید";
    else if (motherContact.length !== 11)
      motherErr.motherContact = "شماره تماس باید ۱۱ رقم باشد";
    if (!motherNationalCode)
      motherErr.motherNationalCode = "کد ملی مادر را وارد کنید";
    if (!motherEducation)
      motherErr.motherEducation = "تحصیلات مادر را وارد کنید";
    if (!motherWorkAddress)
      motherErr.motherWorkAddress = "آدرس محل کار مادر را وارد کنید";
    setMotherErrors(motherErr);

    let educationErr = {};
    if (!prevSchool) {
      setPrevSchoolError("نام آموزشگاه سال قبل را وارد کنید");
      educationErr.prevSchool = true;
    } else {
      setPrevSchoolError("");
    }
    if (!prevAvg) {
      setPrevAvgError("معدل کل سال قبل را وارد کنید");
      educationErr.prevAvg = true;
    } else {
      setPrevAvgError("");
    }
    if (!prevDiscipline) {
      setPrevDisciplineError("انضباط سال گذشته را وارد کنید");
      educationErr.prevDiscipline = true;
    } else {
      setPrevDisciplineError("");
    }

    if (!reportCardFile) {
      setReportCardRequiredError("آپلود تصویر کارنامه الزامی است.");
    } else {
      setReportCardRequiredError("");
    }

    if (!acceptFee) {
      setAcceptFeeError("لطفا تیک پذیرش هزینه را بزنید.");
    } else {
      setAcceptFeeError("");
    }

    setErrors(newErrors);

    const allErrors = [];
    if (Object.keys(newErrors).length > 0)
      allErrors.push({ type: "student", key: Object.keys(newErrors)[0] });
    if (Object.keys(parentErr).length > 0)
      allErrors.push({ type: "parent", key: Object.keys(parentErr)[0] });
    if (Object.keys(motherErr).length > 0)
      allErrors.push({ type: "mother", key: Object.keys(motherErr)[0] });
    if (educationErr.prevSchool)
      allErrors.push({ type: "education", key: "prevSchool" });
    if (educationErr.prevAvg)
      allErrors.push({ type: "education", key: "prevAvg" });
    if (educationErr.prevDiscipline)
      allErrors.push({ type: "education", key: "prevDiscipline" });
    if (!acceptFee) allErrors.push({ type: "acceptFee", key: "acceptFee" });
    if (!reportCardFile)
      allErrors.push({ type: "reportCard", key: "reportCardSection" });

    if (allErrors.length > 0) {
      const first = allErrors[0];
      if (first.type === "student" && refs[first.key]?.current) {
        refs[first.key].current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        refs[first.key].current.focus();
      } else if (first.type === "parent") {
        document
          .querySelector("input[name='parentFirstName']")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (first.type === "mother") {
        document
          .querySelector("input[name='motherFirstName']")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (first.type === "education") {
        if (first.key === "prevSchool")
          document
            .querySelector("input[value='" + prevSchool + "']")
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        if (first.key === "prevAvg")
          document
            .querySelector("input[value='" + prevAvg + "']")
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        if (first.key === "prevDiscipline")
          document
            .querySelector("input[value='" + prevDiscipline + "']")
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (first.type === "acceptFee") {
        document
          .getElementById("acceptFee")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (first.type === "reportCard") {
        document
          .getElementById("reportCardSection")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setShowModal(true);
    setFormDisabled(true);
  };

  const handleEdit = () => {
    setFormDisabled(false);
    setShowModal(false);
  };

  const inputDisabledClass = formDisabled
    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
    : "";

  return (
    <main className="max-w-screen-lg mx-auto p-6 relative">
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-xs w-full text-center">
            <h3 className="text-lg font-bold mb-4 text-green-700">
              اطلاعات شما با موفقیت ثبت شد!
            </h3>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={() => setShowModal(false)}
            >
              باشه
            </button>
          </div>
        </div>
      )}

      {formDisabled && !showModal && (
        <div className="flex justify-center mb-6">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={handleEdit}
          >
            ویرایش اطلاعات
          </button>
        </div>
      )}

      <div className={formDisabled ? "pointer-events-none opacity-60" : ""}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bb2 mb-[5rem]">
            <div>
              <label className="block mb-1 font-medium">نام:</label>
              <input
                ref={refs.firstName}
                type="text"
                value={firstName}
                onChange={handlePersianInput(setFirstName)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.firstName
                    ? "border-red-500 ring-red-400"
                    : "focus:ring-blue-400"
                } ${inputDisabledClass}`}
                disabled={formDisabled}
              />
              {errors.firstName && (
                <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">نام خانوادگی:</label>
              <input
                ref={refs.lastName}
                type="text"
                value={lastName}
                onChange={handlePersianInput(setLastName)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.lastName
                    ? "border-red-500 ring-red-400"
                    : "focus:ring-blue-400"
                } ${inputDisabledClass}`}
                disabled={formDisabled}
              />
              {errors.lastName && (
                <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">نام پدر:</label>
              <input
                ref={refs.fatherName}
                type="text"
                value={fatherName}
                onChange={handlePersianInput(setFatherName)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.fatherName
                    ? "border-red-500 ring-red-400"
                    : "focus:ring-blue-400"
                } ${inputDisabledClass}`}
                disabled={formDisabled}
              />
              {errors.fatherName && (
                <p className="text-red-600 text-sm mt-1">{errors.fatherName}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">شماره ملی:</label>
              <input
                ref={refs.nationalCode}
                type="text"
                maxLength={10}
                value={nationalCode}
                onChange={handleNumberInput(setNationalCode, 10)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.nationalCode
                    ? "border-red-500 ring-red-400"
                    : "focus:ring-blue-400"
                } ${inputDisabledClass}`}
                disabled={formDisabled}
              />
              {errors.nationalCode && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.nationalCode}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">تاریخ تولد:</label>
              <DatePicker
                value={birthDateObj}
                onChange={(date) => {
                  setBirthDateObj(date);
                  if (date) {
                    setBirthDate(
                      `${date.year}/${date.month
                        .toString()
                        .padStart(2, "0")}/${date.day
                        .toString()
                        .padStart(2, "0")}`
                    );
                  } else {
                    setBirthDate("");
                  }
                }}
                calendar={persian}
                locale={persian_fa}
                shouldHighlightWeekends
                inputPlaceholder="انتخاب تاریخ"
                colorPrimary="#198754"
                inputClassName={`w-full h-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.birthDate
                    ? "border-red-500 ring-red-400"
                    : "focus:ring-blue-400"
                } ${inputDisabledClass}`}
                disabled={formDisabled}
                maxDate={new Date()}
                renderInput={(props) => (
                  <input
                    {...props}
                    ref={refs.birthDate}
                    readOnly
                    value={birthDate}
                    placeholder="انتخاب تاریخ"
                    className={`w-full h-20 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.birthDate
                        ? "border-red-500 ring-red-400"
                        : "focus:ring-blue-400"
                    } ${inputDisabledClass}`}
                    style={{ height: "40px" }}
                  />
                )}
              />
              {errors.birthDate && (
                <p className="text-red-600 text-sm mt-1">{errors.birthDate}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">محل تولد:</label>
              <div ref={refs.birthPlace}>
                <Select
                  options={iranCities}
                  value={birthPlace}
                  onChange={setBirthPlace}
                  placeholder="انتخاب شهر"
                  classNamePrefix={
                    errors.birthPlace ? "react-select-error" : "react-select"
                  }
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: errors.birthPlace
                        ? "#f87171"
                        : base.borderColor,
                      "&:hover": {
                        borderColor: errors.birthPlace
                          ? "#f87171"
                          : base.borderColor,
                      },
                      boxShadow: errors.birthPlace
                        ? "0 0 0 1px #f87171"
                        : base.boxShadow,
                    }),
                  }}
                />
              </div>
              {errors.birthPlace && (
                <p className="text-red-600 text-sm mt-1">{errors.birthPlace}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">پایه تحصیلی:</label>
              <div ref={refs.grade}>
                <Select
                  options={grades}
                  value={grade}
                  onChange={setGrade}
                  placeholder="انتخاب پایه"
                  classNamePrefix={
                    errors.grade ? "react-select-error" : "react-select"
                  }
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: errors.grade ? "#f87171" : base.borderColor,
                      "&:hover": {
                        borderColor: errors.grade
                          ? "#f87171"
                          : base.borderColor,
                      },
                      boxShadow: errors.grade
                        ? "0 0 0 1px #f87171"
                        : base.boxShadow,
                    }),
                  }}
                />
              </div>
              {errors.grade && (
                <p className="text-red-600 text-sm mt-1">{errors.grade}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">رشته:</label>
              <div ref={refs.major}>
                <Select
                  options={majors}
                  value={major}
                  onChange={setMajor}
                  placeholder="انتخاب رشته"
                  classNamePrefix={
                    errors.major ? "react-select-error" : "react-select"
                  }
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: errors.major ? "#f87171" : base.borderColor,
                      "&:hover": {
                        borderColor: errors.major
                          ? "#f87171"
                          : base.borderColor,
                      },
                      boxShadow: errors.major
                        ? "0 0 0 1px #f87171"
                        : base.boxShadow,
                    }),
                  }}
                />
              </div>
              {errors.major && (
                <p className="text-red-600 text-sm mt-1">{errors.major}</p>
              )}
            </div>

            <div className="flex flex-col w-full">
              <label className="block mb-1 font-medium">شماره شناسنامه:</label>
              <div className="flex gap-2 items-center">
                <input
                  ref={refs.serialNumber}
                  type="text"
                  maxLength={2}
                  value={serialNumber}
                  onChange={handleNumberInput(setSerialNumber, 2)}
                  className={`w-16 text-center px-2 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.serialNumber
                      ? "border-red-500 ring-red-400"
                      : "focus:ring-blue-400"
                  } ${inputDisabledClass}`}
                  disabled={formDisabled}
                  placeholder="12"
                />
                <span className="text-gray-400">-</span>
                <input
                  ref={refs.serialNumber2}
                  type="text"
                  maxLength={3}
                  value={serialNumber2}
                  onChange={handleNumberInput(setSerialNumber2, 3)}
                  className={`w-16 text-center px-2 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.serialNumber2
                      ? "border-red-500 ring-red-400"
                      : "focus:ring-blue-400"
                  } ${inputDisabledClass}`}
                  disabled={formDisabled}
                  placeholder="123"
                />
                <span className="text-gray-400">-</span>
                <div className="w-16">
                  <Select
                    options={alefOptions}
                    value={serialAlpha}
                    onChange={setSerialAlpha}
                    placeholder="حرف"
                    classNamePrefix={
                      errors.serialAlpha ? "react-select-error" : "react-select"
                    }
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: "36px",
                        height: "36px",
                        fontSize: "0.95rem",
                        borderColor: errors.serialAlpha
                          ? "#f87171"
                          : base.borderColor,
                        boxShadow: errors.serialAlpha
                          ? "0 0 0 1px #f87171"
                          : base.boxShadow,
                      }),
                      indicatorsContainer: (base) => ({
                        ...base,
                        height: "36px",
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        height: "36px",
                        padding: "0 8px",
                      }),
                      input: (base) => ({
                        ...base,
                        margin: 0,
                        padding: 0,
                      }),
                    }}
                    isDisabled={formDisabled}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-1">
                <div className="w-16">
                  {errors.serialNumber && (
                    <p className="text-red-600 text-xs">
                      {errors.serialNumber}
                    </p>
                  )}
                </div>
                <div className="w-16">
                  {errors.serialNumber2 && (
                    <p className="text-red-600 text-xs">
                      {errors.serialNumber2}
                    </p>
                  )}
                </div>
                <div className="w-16">
                  {errors.serialAlpha && (
                    <p className="text-red-600 text-xs">{errors.serialAlpha}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">شماره تماس:</label>
              <input
                ref={refs.contactNumber}
                type="text"
                maxLength={11}
                value={contactNumber}
                onChange={handleNumberInput(setContactNumber, 11)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.contactNumber
                    ? "border-red-500 ring-red-400"
                    : "focus:ring-blue-400"
                } ${inputDisabledClass}`}
                disabled={formDisabled}
              />
              {errors.contactNumber && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.contactNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">شماره منزل:</label>
              <input
                ref={refs.homeNumber}
                type="text"
                maxLength={11}
                value={homeNumber}
                onChange={handleNumberInput(setHomeNumber, 11)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.homeNumber
                    ? "border-red-500 ring-red-400"
                    : "focus:ring-blue-400"
                } ${inputDisabledClass}`}
                disabled={formDisabled}
              />
              {errors.homeNumber && (
                <p className="text-red-600 text-sm mt-1">{errors.homeNumber}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">محل صدور:</label>
              <div ref={refs.birthPlace}>
                <Select
                  options={iransodoor}
                  value={iranSodoor}
                  onChange={setIranSodoor}
                  placeholder="انتخاب شهر"
                  classNamePrefix={
                    errors.birthPlace ? "react-select-error" : "react-select"
                  }
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: errors.birthPlace
                        ? "#f87171"
                        : base.borderColor,
                      "&:hover": {
                        borderColor: errors.birthPlace
                          ? "#f87171"
                          : base.borderColor,
                      },
                      boxShadow: errors.birthPlace
                        ? "0 0 0 1px #f87171"
                        : base.boxShadow,
                    }),
                  }}
                />
              </div>
              {errors.birthPlace && (
                <p className="text-red-600 text-sm mt-1">{errors.birthPlace}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">آدرس خانه:</label>
              <textarea
                value={address}
                onChange={handleAddressChange}
                className={`w-full h-48 px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 ${
                  addressError
                    ? "border-red-500 ring-red-400"
                    : "focus:ring-blue-400"
                }`}
              />
              {addressError && (
                <p className="text-red-600 text-sm mt-1">{addressError}</p>
              )}
            </div>

            <div className="md:col-span-2 mb-[5rem]">
              <label className="block mb-1 font-medium">بارگذاری عکس:</label>
              <div className="flex flex-col w-full items-center md:items-start">
                <div className="flex flex-col md:flex-row items-center justify-center md:items-start md:justify-start md:gap-8 w-full">
                  <div
                    className={`relative border-2 border-dashed rounded-md w-48 h-48 flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition overflow-hidden ${
                      imageError ? "border-red-500" : "border-gray-300"
                    }`}
                    onClick={() =>
                      fileInputRef.current && fileInputRef.current.click()
                    }
                    style={{ direction: "ltr" }}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="آپلود شده"
                        style={{
                          transform: `scale(${zoom}) translateX(${xOffset}px) translateY(${yOffset}px)`,
                          transition: "transform 0.2s",
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                          pointerEvents: "none",
                          userSelect: "none",
                        }}
                      />
                    ) : (
                      <span className="text-gray-400">
                        برای آپلود کلیک کنید
                      </span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                      className="hidden"
                    />
                  </div>

                  {imageUrl && (
                    <div className="flex flex-col gap-8 mt-6 md:mt-0 md:mr-8 items-center md:items-start">
                      <div className="flex items-center gap-2 w-48">
                        <span className="text-xs text-gray-500">+</span>
                        <input
                          type="range"
                          min="1"
                          max="3"
                          step="0.01"
                          value={zoom}
                          onChange={(e) => setZoom(Number(e.target.value))}
                          className="w-full accent-green-600"
                          style={{ direction: "ltr" }}
                        />
                        <span className="text-xs text-gray-500">-</span>
                      </div>
                      <div className="flex items-center gap-2 w-48">
                        <span className="text-xs text-gray-500">→</span>
                        <input
                          type="range"
                          min="-60"
                          max="60"
                          step="1"
                          value={xOffset}
                          onChange={(e) => setXOffset(Number(e.target.value))}
                          className="w-full accent-blue-600"
                          style={{ direction: "ltr" }}
                        />
                        <span className="text-xs text-gray-500">←</span>
                      </div>
                      <div className="flex items-center gap-2 w-48">
                        <span className="text-xs text-gray-500">↑</span>
                        <input
                          type="range"
                          min="-60"
                          max="60"
                          step="1"
                          value={yOffset}
                          onChange={(e) => setYOffset(Number(e.target.value))}
                          className="w-full accent-blue-600"
                          style={{ direction: "ltr" }}
                        />
                        <span className="text-xs text-gray-500">↓</span>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500 mt-2 block">
                  حجم عکس باید کمتر از ۱۵۰ کیلوبایت باشد.
                </span>
                {imageError && (
                  <p className="text-red-600 text-sm mt-1">{imageError}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-start pt-8 pb-8">
            <h2 className="text-[25px] bb1 text-[#198754] font-extrabold ">
              اطلاعات والدین:
            </h2>
          </div>
          <div className="bb2 mb-[5rem] ">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-[1rem]">
              <div>
                <label className="block mb-1 font-medium">نام پدر:</label>
                <input
                  type="text"
                  value={parentFirstName}
                  onChange={handlePersianInput(setParentFirstName)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    parentErrors.parentFirstName
                      ? "border-red-500 ring-red-400"
                      : "focus:ring-blue-400"
                  } ${inputDisabledClass}`}
                  disabled={formDisabled}
                />
                {parentErrors.parentFirstName && (
                  <p className="text-red-600 text-sm mt-1">
                    {parentErrors.parentFirstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">نام خانوادگی:</label>
                <input
                  type="text"
                  value={parentLastName}
                  onChange={handlePersianInput(setParentLastName)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    parentErrors.parentLastName
                      ? "border-red-500 ring-red-400"
                      : "focus:ring-blue-400"
                  } ${inputDisabledClass}`}
                  disabled={formDisabled}
                />
                {parentErrors.parentLastName && (
                  <p className="text-red-600 text-sm mt-1">
                    {parentErrors.parentLastName}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium">شغل:</label>
                <input
                  type="text"
                  value={parentJob}
                  onChange={handlePersianInput(setParentJob)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    parentErrors.parentJob
                      ? "border-red-500 ring-red-400"
                      : "focus:ring-blue-400"
                  } ${inputDisabledClass}`}
                  disabled={formDisabled}
                />
                {parentErrors.parentJob && (
                  <p className="text-red-600 text-sm mt-1">
                    {parentErrors.parentJob}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">شماره تماس:</label>
                <input
                  type="text"
                  maxLength={11}
                  value={parentContact}
                  onChange={handleNumberInput(setParentContact, 11)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    parentErrors.parentContact
                      ? "border-red-500 ring-red-400"
                      : "focus:ring-blue-400"
                  } ${inputDisabledClass}`}
                  disabled={formDisabled}
                />
                {parentErrors.parentContact && (
                  <p className="text-red-600 text-sm mt-1">
                    {parentErrors.parentContact}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">کد ملی (پدر):</label>
                <input
                  type="text"
                  maxLength={10}
                  value={parentNationalCode}
                  onChange={handleNumberInput(setParentNationalCode, 10)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    parentErrors.parentNationalCode
                      ? "border-red-500 ring-red-400"
                      : ""
                  } ${inputDisabledClass}`}
                  disabled={formDisabled}
                />
                {parentErrors.parentNationalCode && (
                  <p className="text-red-600 text-sm mt-1">
                    {parentErrors.parentNationalCode}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">تحصیلات:</label>
                <input
                  type="text"
                  value={parentEducation}
                  onChange={handlePersianInput(setParentEducation)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    parentErrors.parentEducation
                      ? "border-red-500 ring-red-400"
                      : ""
                  } ${inputDisabledClass}`}
                  disabled={formDisabled}
                />
                {parentErrors.parentEducation && (
                  <p className="text-red-600 text-sm mt-1">
                    {parentErrors.parentEducation}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">آدرس محل کار:</label>
                <input
                  type="text"
                  value={parentWorkAddress}
                  onChange={(e) => setParentWorkAddress(e.target.value)}
                  className={`w-full md:w-full mx-auto px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    parentErrors.parentWorkAddress
                      ? "border-red-500 ring-red-400"
                      : ""
                  } ${inputDisabledClass}`}
                  disabled={formDisabled}
                />
                {parentErrors.parentWorkAddress && (
                  <p className="text-red-600 text-sm mt-1">
                    {parentErrors.parentWorkAddress}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-[5rem]">
              <div>
                <label className="block mb-1 font-medium">نام مادر:</label>
                <input
                  type="text"
                  value={motherFirstName}
                  onChange={handlePersianInput(setMotherFirstName)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    motherErrors.motherFirstName
                      ? "border-red-500 ring-red-400"
                      : "focus:ring-blue-400"
                  } ${inputDisabledClass}`}
                  disabled={formDisabled}
                />
                {motherErrors.motherFirstName && (
                  <p className="text-red-600 text-sm mt-1">
                    {motherErrors.motherFirstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">نام خانوادگی:</label>
                <input
                  type="text"
                  value={motherLastName}
                  onChange={handlePersianInput(setMotherLastName)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    motherErrors.motherLastName
                      ? "border-red-500 ring-red-400"
                      : "focus:ring-blue-400"
                  } ${inputDisabledClass}`}
                  disabled={formDisabled}
                />
                {motherErrors.motherLastName && (
                  <p className="text-red-600 text-sm mt-1">
                    {motherErrors.motherLastName}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium">شغل:</label>
                <input
                  type="text"
                  value={motherJob}
                  onChange={handlePersianInput(setMotherJob)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    motherErrors.motherJob
                      ? "border-red-500 ring-red-400"
                      : "focus:ring-blue-400"
                  } ${inputDisabledClass}`}
                  disabled={formDisabled}
                />
                {motherErrors.motherJob && (
                  <p className="text-red-600 text-sm mt-1">
                    {motherErrors.motherJob}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">شماره تماس:</label>
                <input
                  type="text"
                  maxLength={11}
                  value={motherContact}
                  onChange={handleNumberInput(setMotherContact, 11)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    motherErrors.motherContact
                      ? "border-red-500 ring-red-400"
                      : "focus:ring-blue-400"
                  } ${inputDisabledClass}`}
                  disabled={formDisabled}
                />
                {motherErrors.motherContact && (
                  <p className="text-red-600 text-sm mt-1">
                    {motherErrors.motherContact}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">کد ملی (مادر):</label>
                <input
                  type="text"
                  maxLength={10}
                  value={motherNationalCode}
                  onChange={handleNumberInput(setMotherNationalCode, 10)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    motherErrors.motherNationalCode
                      ? "border-red-500 ring-red-400"
                      : ""
                  } ${inputDisabledClass}`}
                  disabled={formDisabled}
                />
                {motherErrors.motherNationalCode && (
                  <p className="text-red-600 text-sm mt-1">
                    {motherErrors.motherNationalCode}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">تحصیلات:</label>
                <input
                  type="text"
                  value={motherEducation}
                  onChange={handlePersianInput(setMotherEducation)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    motherErrors.motherEducation
                      ? "border-red-500 ring-red-400"
                      : ""
                  } ${inputDisabledClass}`}
                  disabled={formDisabled}
                />
                {motherErrors.motherEducation && (
                  <p className="text-red-600 text-sm mt-1">
                    {motherErrors.motherEducation}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">آدرس محل کار:</label>
                <input
                  type="text"
                  value={motherWorkAddress}
                  onChange={(e) => setMotherWorkAddress(e.target.value)}
                  className={`w-full md:w-full mx-auto px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    motherErrors.motherWorkAddress
                      ? "border-red-500 ring-red-400"
                      : ""
                  } ${inputDisabledClass}`}
                  disabled={formDisabled}
                />
                {motherErrors.motherWorkAddress && (
                  <p className="text-red-600 text-sm mt-1">
                    {motherErrors.motherWorkAddress}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-start pt-8 pb-8">
            <h2 className="text-[25px] bb1 text-[#198754] font-extrabold ">
              مشخصات تحصیلی:
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-[2rem]">
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">
                آموزشگاه سال قبل:
              </label>
              <input
                type="text"
                value={prevSchool}
                onChange={handlePersianInput(setPrevSchool)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  prevSchoolError
                    ? "border-red-500 ring-red-400"
                    : "focus:ring-blue-400"
                } ${inputDisabledClass}`}
                disabled={formDisabled}
              />
              {prevSchoolError && (
                <p className="text-red-600 text-sm mt-1">{prevSchoolError}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 font-medium">معدل کل سال قبل:</label>
              <input
                type="text"
                value={prevAvg}
                onChange={(e) => {
                  let value = e.target.value.replace(/[^0-9.]/g, "");
                  const parts = value.split(".");
                  if (parts.length > 2)
                    value = parts[0] + "." + parts.slice(1).join("");
                  // فقط دو رقم اعشار مجاز باشد
                  if (parts[1]?.length > 2)
                    value = parts[0] + "." + parts[1].slice(0, 2);
                  if (value && parseFloat(value) > 20) return;
                  setPrevAvg(value);
                  if (prevAvgError && value) setPrevAvgError("");
                }}
                placeholder="مثلاً 19.99"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  prevAvgError
                    ? "border-red-500 ring-red-400"
                    : "focus:ring-blue-400"
                } ${inputDisabledClass}`}
                disabled={formDisabled}
              />
              <span className="text-xs text-blue-500 mt-1 block">
                لطفاً بجای اعشار (/) از نقطه(.) استفاده کنید
              </span>
              {prevAvgError && (
                <p className="text-red-600 text-sm mt-1">{prevAvgError}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 font-medium">
                انضباط سال گذشته:
              </label>
              <input
                type="text"
                value={prevDiscipline}
                onChange={(e) => {
                  let value = e.target.value.replace(/[^0-9.]/g, "");
                  const parts = value.split(".");
                  if (parts.length > 2)
                    value = parts[0] + "." + parts.slice(1).join("");
                  if (parts[1]?.length > 2)
                    value = parts[0] + "." + parts[1].slice(0, 2);
                  if (value && parseFloat(value) > 20) return;
                  setPrevDiscipline(value);
                  if (prevDisciplineError && value) setPrevDisciplineError("");
                }}
                placeholder="مثلاً 20"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  prevDisciplineError
                    ? "border-red-500 ring-red-400"
                    : "focus:ring-blue-400"
                } ${inputDisabledClass}`}
                disabled={formDisabled}
              />
              <span className="text-xs text-blue-500 mt-1 block">
                لطفاً بجای اعشار (/) از نقطه(.) استفاده کنید
              </span>
              {prevDisciplineError && (
                <p className="text-red-600 text-sm mt-1">
                  {prevDisciplineError}
                </p>
              )}
            </div>
          </div>
          <div className="md:col-span-2 mb-[5rem]" id="reportCardSection">
            <label className="block mb-1 font-medium">
              بارگذاری تصویر کارنامه:
            </label>
            <div className="flex flex-col w-full items-center md:items-start">
              <div className="flex flex-col md:flex-row items-center justify-center md:items-start md:justify-start md:gap-8 w-full">
                <div
                  className={`relative border-2 border-dashed rounded-md w-48 h-48 flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition overflow-hidden ${
                    reportCardError ? "border-red-500" : "border-gray-300"
                  }`}
                  onClick={() =>
                    reportCardInputRef.current &&
                    reportCardInputRef.current.click()
                  }
                  style={{ direction: "ltr" }}
                >
                  {reportCardUrl ? (
                    <img
                      src={reportCardUrl}
                      alt="کارنامه آپلود شده"
                      style={{
                        transform: `scale(${reportCardZoom}) translateX(${reportCardXOffset}px) translateY(${reportCardYOffset}px)`,
                        transition: "transform 0.2s",
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                        userSelect: "none",
                      }}
                    />
                  ) : (
                    <span className="text-gray-400">برای آپلود کلیک کنید</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleReportCardChange}
                    ref={reportCardInputRef}
                    className="hidden"
                  />
                </div>
                {reportCardUrl && (
                  <div className="flex flex-col gap-8 mt-6 md:mt-0 md:mr-8 items-center md:items-start">
                    <div className="flex items-center gap-2 w-48">
                      <span className="text-xs text-gray-500">+</span>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.01"
                        value={reportCardZoom}
                        onChange={(e) =>
                          setReportCardZoom(Number(e.target.value))
                        }
                        className="w-full accent-green-600"
                        style={{ direction: "ltr" }}
                      />
                      <span className="text-xs text-gray-500">-</span>
                    </div>
                    <div className="flex items-center gap-2 w-48">
                      <span className="text-xs text-gray-500">→</span>
                      <input
                        type="range"
                        min="-60"
                        max="60"
                        step="1"
                        value={reportCardXOffset}
                        onChange={(e) =>
                          setReportCardXOffset(Number(e.target.value))
                        }
                        className="w-full accent-blue-600"
                        style={{ direction: "ltr" }}
                      />
                      <span className="text-xs text-gray-500">←</span>
                    </div>
                    <div className="flex items-center gap-2 w-48">
                      <span className="text-xs text-gray-500">↑</span>
                      <input
                        type="range"
                        min="-60"
                        max="60"
                        step="1"
                        value={reportCardYOffset}
                        onChange={(e) =>
                          setReportCardYOffset(Number(e.target.value))
                        }
                        className="w-full accent-blue-600"
                        style={{ direction: "ltr" }}
                      />
                      <span className="text-xs text-gray-500">↓</span>
                      <button
                        type="button"
                        onClick={handleRemoveReportCard}
                        className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-500 mt-2 block">
                حجم عکس باید کمتر از ۱۵۰ کیلوبایت باشد.
              </span>
              {reportCardError && (
                <p className="text-red-600 text-sm mt-1">{reportCardError}</p>
              )}
              {reportCardRequiredError && (
                <p className="text-red-600 text-sm mt-1">
                  {reportCardRequiredError}
                </p>
              )}
            </div>
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="acceptFee"
                className="ml-2 w-5 h-5 accent-green-600"
                checked={acceptFee}
                onChange={(e) => setAcceptFee(e.target.checked)}
              />
              <label htmlFor="acceptFee" className="text-sm select-none">
                ضمن قبول پرداخت پنجاه میلیون ریال هزینه علی الحساب، مصوب هیئت
                امنای دبیرستان، متقاضی ثبت نام می باشم
              </label>
            </div>
            {acceptFeeError && (
              <p className="text-red-600 text-sm mt-1">{acceptFeeError}</p>
            )}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition"
              disabled={formDisabled}
            >
              ثبت نام
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
export default MainOfMyPage;
