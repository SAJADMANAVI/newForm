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
import axios from "axios";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./utils/cropImage"; // اصلاح ایمپورت برای استفاده از اکسپورت معمولی

// Define personalPic and lastKarname with initial values

function MainOfMyPage() {
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [formDisabled, setFormDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [zoom, setZoom] = useState(1);
  const [imageError, setImageError] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [currentImageForCrop, setCurrentImageForCrop] = useState(null);

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
  const [prevAvg, setPrevAvg] = useState("");
  const [prevDiscipline, setPrevDiscipline] = useState("");
  const [prevDisciplineError, setPrevDisciplineError] = useState("");
  const [prevSchoolError, setPrevSchoolError] = useState(""); // Define prevSchoolError state
  const reportCardInputRef = useRef(null); // Ref for the report card input element
  const [prevAvgError, setPrevAvgError] = useState(""); // State for managing previous average error

  const [errors, setErrors] = useState({});
  const [acceptFee, setAcceptFee] = useState(false);
  const [acceptFeeError, setAcceptFeeError] = useState("");
  const [reportCardError, setReportCardError] = useState("");
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

  const openCropModal = (imageUrl) => {
    setCurrentImageForCrop(imageUrl);
    setIsCropModalOpen(true);
  };

  const closeCropModal = () => {
    setIsCropModalOpen(false);
    setCurrentImageForCrop(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.error("No file selected.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setImageError("لطفا فقط فایل عکس انتخاب کنید.");
      return;
    }

    if (file.size > 150 * 1024) {
      setImageError("حجم عکس باید کمتر از ۱۵۰ کیلوبایت باشد.");
      return;
    }

    setImageError("");
    const url = URL.createObjectURL(file);
    openCropModal(url);
  };

  const handleRemoveImage = () => {
    setZoom(1);
    fileInputRef.current.value = null;
  };

  const [reportCardFile, setReportCardFile] = useState(null);
  const [reportCardUrl, setReportCardUrl] = useState(null);
  const [reportCardZoom, setReportCardZoom] = useState(1);
  const [reportCardXOffset, setReportCardXOffset] = useState(0);
  const [reportCardYOffset, setReportCardYOffset] = useState(0);

  const [isReportCardCropModalOpen, setIsReportCardCropModalOpen] =
    useState(false);
  const [currentReportCardForCrop, setCurrentReportCardForCrop] =
    useState(null);
  const [reportCardCrop, setReportCardCrop] = useState({ x: 0, y: 0 });
  const [reportCardCropZoom, setReportCardCropZoom] = useState(1);
  const [reportCardCroppedAreaPixels, setReportCardCroppedAreaPixels] =
    useState(null);
  const [croppedReportCardImage, setCroppedReportCardImage] = useState(null);

  const openReportCardCropModal = (imageUrl) => {
    setCurrentReportCardForCrop(imageUrl);
    setIsReportCardCropModalOpen(true);
  };

  const closeReportCardCropModal = () => {
    setIsReportCardCropModalOpen(false);
    setCurrentReportCardForCrop(null);
  };

  const handleReportCardChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.error("No file selected for reportCardFile.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setReportCardError("لطفا فقط فایل عکس انتخاب کنید.");
      return;
    }

    if (file.size > 150 * 1024) {
      setReportCardError("حجم عکس باید کمتر از ۱۵۰ کیلوبایت باشد.");
      return;
    }

    setReportCardError("");
    const url = URL.createObjectURL(file);
    openReportCardCropModal(url);
  };

  // const handleRemoveReportCard = () => {
  //   setReportCardFile(null);
  //   setReportCardUrl(null);
  //   setReportCardZoom(1);
  //   setReportCardXOffset(0);
  //   setReportCardYOffset(0);
  //   reportCardInputRef.current.value = null;
  // };

  const handleRemoveReportCard = () => {
    setReportCardFile(null);
    setReportCardUrl(null);
    setReportCardZoom(1);
    setReportCardCropZoom(1); // ← این خط مهمه
    setReportCardCrop({ x: 0, y: 0 });
    setReportCardCroppedAreaPixels(null);
    reportCardInputRef.current.value = null;
    setCroppedReportCardImage(null);
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

  // Updated handleSubmit function to ensure proper validation and submission of form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    // اعتبارسنجی اولیه
    let newErrors = {};
    let parentErr = {};
    let motherErr = {};
    let eduErr = {};
    if (!firstName) newErrors.firstName = "نام را وارد کنید";
    if (!lastName) newErrors.lastName = "نام خانوادگی را وارد کنید";
    if (!fatherName) newErrors.fatherName = "نام پدر را وارد کنید";
    if (!nationalCode) newErrors.nationalCode = "شماره ملی را وارد کنید";
    else if (nationalCode.length !== 10)
      newErrors.nationalCode = "شماره ملی باید ۱۰ رقم باشد";
    if (!birthDate) newErrors.birthDate = "تاریخ تولد را وارد کنید";
    if (!birthPlace?.value) newErrors.birthPlace = "محل تولد را انتخاب کنید";
    if (!grade?.value) newErrors.grade = "پایه تحصیلی را انتخاب کنید";
    if (!major?.value) newErrors.major = "رشته تحصیلی را انتخاب کنید";
    if (!serialAlpha?.value)
      newErrors.serialAlpha = "حرف الف سریال را انتخاب کنید";
    if (!serialNumber)
      newErrors.serialNumber = "بخش اول سریال شناسنامه را وارد کنید";
    else if (serialNumber.length !== 2)
      newErrors.serialNumber = "باید ۲ رقم باشد";
    if (!serialNumber2)
      newErrors.serialNumber2 = "بخش دوم سریال شناسنامه را وارد کنید";
    else if (serialNumber2.length !== 3)
      newErrors.serialNumber2 = "باید ۳ رقم باشد";
    if (!contactNumber) newErrors.contactNumber = "شماره تماس را وارد کنید";
    else if (contactNumber.length !== 11)
      newErrors.contactNumber = "باید ۱۱ رقم باشد";
    if (!homeNumber) newErrors.homeNumber = "شماره منزل را وارد کنید";
    else if (homeNumber.length !== 11)
      newErrors.homeNumber = "باید ۱۱ رقم باشد";
    if (address.trim() === "") setAddressError("وارد کردن آدرس الزامی است.");
    else setAddressError("");
    if (!croppedImage) setImageError("آپلود عکس الزامی است.");
    else setImageError("");
    if (!parentFirstName) parentErr.parentFirstName = "نام پدر را وارد کنید";
    if (!parentLastName) parentErr.parentLastName = "نام خانوادگی را وارد کنید";
    if (!parentJob) parentErr.parentJob = "شغل را وارد کنید";
    if (!parentContact) parentErr.parentContact = "شماره تماس را وارد کنید";
    else if (parentContact.length !== 11)
      parentErr.parentContact = "باید ۱۱ رقم باشد";
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
      motherErr.motherContact = "باید ۱۱ رقم باشد";
    if (!motherNationalCode)
      motherErr.motherNationalCode = "کد ملی مادر را وارد کنید";
    if (!motherEducation)
      motherErr.motherEducation = "تحصیلات مادر را وارد کنید";
    if (!motherWorkAddress)
      motherErr.motherWorkAddress = "آدرس محل کار مادر را وارد کنید";
    setMotherErrors(motherErr);
    if (!prevSchool) eduErr.prevSchool = "مدرسه قبلی را وارد کنید";
    if (!prevAvg) eduErr.prevAvg = "معدل را وارد کنید";
    if (!prevDiscipline) eduErr.prevDiscipline = "نمره انضباط را وارد کنید";
    if (!reportCardFile) setReportCardError("آپلود کارنامه الزامی است.");
    else setReportCardError("");
    if (!acceptFee) setAcceptFeeError("پذیرش قوانین الزامی است.");
    else setAcceptFeeError("");
    setErrors(newErrors);
    // اگر خطا وجود داشت ارسال نکن
    if (
      Object.keys(newErrors).length > 0 ||
      Object.keys(parentErr).length > 0 ||
      Object.keys(motherErr).length > 0 ||
      Object.keys(eduErr).length > 0 ||
      !acceptFee ||
      !croppedImage ||
      !croppedReportCardImage // Make sure cropped image exists
    ) {
      return;
    }
    // ارسال داده‌ها
    const formData = new FormData();
    formData.append("st_personal_pic", croppedImage);
    // Convert croppedReportCardImage (blob URL) to File and append
    const response = await fetch(croppedReportCardImage);
    const blob = await response.blob();
    const file = new File([blob], "report_card.jpg", { type: blob.type });
    formData.append("last_karname", file);
    formData.append("st_fname", firstName);
    formData.append("st_lname", lastName);
    formData.append("st_faname", fatherName);
    formData.append("st_id_no", nationalCode);
    formData.append("st_birthdate", birthDate);
    formData.append("st_birthplace", birthPlace?.value);
    formData.append("st_phone", contactNumber);
    formData.append("st_home_phone", homeNumber);
    formData.append("st_address", address);
    formData.append("st_field", major?.value);
    formData.append("st_grade", grade?.value);
    formData.append("st_serial_alpha", serialAlpha?.value);
    formData.append("st_serial_number", serialNumber);
    formData.append("st_serial_number2", serialNumber2);
    formData.append("fa_fname", parentFirstName);
    formData.append("fa_lname", parentLastName);
    formData.append("fa_job", parentJob);
    formData.append("fa_work_address", parentWorkAddress);
    formData.append("fa_phone", parentContact);
    formData.append("fa_id_no", parentNationalCode);
    formData.append("fa_education", parentEducation);
    formData.append("mo_fname", motherFirstName);
    formData.append("mo_lname", motherLastName);
    formData.append("mo_work_address", motherWorkAddress);
    formData.append("mo_job", motherJob);
    formData.append("mo_phone", motherContact);
    formData.append("mo_id_no", motherNationalCode);
    formData.append("mo_education", motherEducation);
    formData.append("last_school", prevSchool);
    formData.append("last_avrage", prevAvg);
    formData.append("last_enzebat", prevDiscipline);
    formData.append(
      "st_series",
      `${serialAlpha}${serialNumber}${serialNumber2}`
    );
    formData.append("st_id_card_exportion", "setIranSodoor");

    try {
      await axios.post(
        "https://mandegarhs.ir/amoozyar2/api/students/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (err) {
      if (err.response) {
        console.error("Server error response:", err.response.data);
      } else {
        console.error("An error occurred:", err.message);
      }
    }
  };

  const handleEdit = () => {
    setFormDisabled(false);
    setShowModal(false);
  };

  const inputDisabledClass = formDisabled
    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
    : "";

  const fillDummyData = () => {
    setFirstName("علی");
    setLastName("رضایی");
    setFatherName("حسین");
    setNationalCode("1234567890");
    setBirthDate("2005-03-15");
    setBirthPlace("تهران");
    setIranSodoor("تهران");
    setGrade(grades[0]);
    setMajor("ریاضی");
    setSerialAlpha("الف");
    setSerialNumber("12");
    setSerialNumber2("345");
    setContactNumber("09123456789");
    setHomeNumber("02530000000");
    setAddress("No. 123, Main St, Tehran");
    setParentFirstName("احمد");
    setParentLastName("احمدی");
    setParentJob("مهندس");
    setParentContact("09129876543");
    setParentNationalCode("0987654321");
    setParentEducation("دیپلم");
    setParentWorkAddress("456 Work St, Tehran");
    setMotherFirstName("فاطمه");
    setMotherLastName("محمدی");
    setMotherJob("معلم");
    setMotherContact("09128765432");
    setMotherNationalCode("1122334455");
    setMotherEducation("لیسانس");
    setMotherWorkAddress("789 Office St");
    setPrevSchool("شهید بهشتی");
    setPrevAvg("12.22");
    setPrevDiscipline("14.5");
  };

  const handlePrevSchoolChange = (e) => {
    const value = e.target.value;
    setPrevSchool(value);
    if (value.trim() !== "") {
      setPrevSchoolError("");
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropImage = async () => {
    if (!currentImageForCrop || !croppedAreaPixels) return;
    try {
      const croppedImg = await getCroppedImg(
        currentImageForCrop,
        croppedAreaPixels
      );
      setCroppedImage(croppedImg);
      closeCropModal();
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  // const handleCropReportCardImage = async () => {
  //   if (!currentReportCardForCrop || !reportCardCroppedAreaPixels) return;
  //   try {
  //     const croppedImg = await getCroppedImg(
  //       currentReportCardForCrop,
  //       reportCardCroppedAreaPixels
  //     );
  //     setCroppedReportCardImage(croppedImg);
  //     closeReportCardCropModal();
  //   } catch (error) {
  //     console.error("Error cropping report card image:", error);
  //   }
  // };

  const handleCropReportCardImage = async () => {
    if (!currentReportCardForCrop || !reportCardCroppedAreaPixels) return;

    try {
      const croppedImg = await getCroppedImg(
        currentReportCardForCrop,
        reportCardCroppedAreaPixels
      );
      setCroppedReportCardImage(croppedImg);
      closeReportCardCropModal();

      // 🔧 ریست کردن مقدارهای کراپ بعد از انجام کراپ
      setReportCardCrop({ x: 0, y: 0 });
      setReportCardCropZoom(1);
      setReportCardCroppedAreaPixels(null);
    } catch (error) {
      console.error("Error cropping report card image:", error);
    }
  };

  // Ensure croppedReportCardImage is only used in img tags
  const renderCroppedReportCardImage = () => {
    if (!croppedReportCardImage) return null;
    return (
      <img
        src={croppedReportCardImage}
        alt="کارنامه آپلود شده"
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />
    );
  };

  return (
    <main className="max-w-screen-lg mx-auto p-6 relative">
      <div className="flex justify-center my-16">
        <p className="main-title-of-page">سامانه ثبت نام</p>
      </div>
      <div className="parentOfform">
        <div>
          <div className="flex flex-col items-center my-4">
            <p>به نام خدا</p>
            <p>مراحل ثبت نام پایه دهم سال تحصیلی 1405-1404</p>
          </div>
          <div className="mb-4">
            <p>
              با سلام و عرض تبریک به شما عزیزان جهت موفقیت در آزمون ورودی
              دبیرستان ماندگار امام صادق (علیه‌السلام )
            </p>
          </div>
          <div className="mb-8">
            <div>
              <h2 className="text-[25px] mb-4">مرحله اول :</h2>
              <p className="mb-4">
                پس از ورود به سایت دبیرستان قسمت ثبت نام ورودی پایه دهم فرم
                مربوطه را تکمیل نموده و کارنامه پایه نهم و عکس را بارگذاری
                نمائید و سپس فرم را پرینت بگیرید. در ضمن فرم های زیر را پرینت
                گرفته و با دقت و خط خوش و خوانا تکمیل نمائید. <br /> <br />
                جهت بارگیری فایل ها روی هر کدام از موارد زیر کلیک کنید
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <a
                className="text-[#0d6efd]"
                href="https://mandegarhs.ir/sabtenam/download.php?filename=tahod.pdf"
              >
                الف) تعهد نامه
              </a>
              <a
                className="text-[#0d6efd]"
                href="https://mandegarhs.ir/sabtenam/download.php?filename=parvareshi.pdf"
              >
                ب) پرورشی
              </a>
              <a
                className="text-[#0d6efd]"
                href="https://mandegarhs.ir/sabtenam/download.php?filename=salamat.pdf"
              >
                ج) آگاهی از سلامت
              </a>
              <p>
                پس از تکمیل فرم‌ها همراه با مدارک ذیل طبق جدول زمان بندی به
                دبیرستان مراجعه فرمائید.
              </p>
            </div>
          </div>
          <div>
            <table cellPadding={10} className="table w-full text-right">
              <thead className="w-full">
                <tr>
                  <th className="text-right">رشته</th>
                  <th className="text-center">تاریخ</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="bg-[#0dcaf0]">
                  <td className="text-right rounded-r-xl">تجربی</td>
                  <td className="text-center rounded-l-xl">
                    دوشنبه 8 وسه شنبه 9 چهارشنبه 10 مرداد 1403
                  </td>
                </tr>
                <tr className="bg-[#ffc107]">
                  <td className="text-right rounded-r-xl">ریاضی</td>
                  <td className="text-center rounded-l-xl">
                    شنبه 13و یک شنبه 14 و دوشنبه 15 مرداد 1403
                  </td>
                </tr>
                <tr className="bg-[#0d6efd]">
                  <td className="text-right rounded-r-xl">انسانی و معارف</td>
                  <td className="text-center rounded-l-xl">
                    سه شنبه 16 مرداد 1403
                  </td>
                </tr>
                <tr className="bg-[#dc3545]">
                  <td className="text-right rounded-r-xl">
                    ذخیره‌ها (در صورت نیاز)
                  </td>
                  <td className="text-center rounded-l-xl">
                    چهارشنبه 17 و پنجشنبه 18 مرداد 1403
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <div className="flex justify-center py-8 font-MyFontTitre text-[30px]">
              <p className="text-[#dc3545]">ساعت مراجعه: 8 لغایت 13</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="mb-2 text-[#0d6efd] text-[25px]">
                مدارک هویتی و شناسنامه ای:
              </p>
              <p>
                1- اصل و کپی شناسنامه عکس دار شده دانش آموز (چنانچه شناسنامه عکس
                دار نشده به مدرسه قبلی مراجعه کرده گواهی اشتغال به تحصیل گرفته
                همراه با ۲ قطعه عکس به دفاتر پیشخوان دولت مراجعه کرده و رسید
                دریافتی تحویل مدارک را به مدرسه ارائه دهید)
              </p>
              <p>2- اصل و کپی شناسنامه و کارت ملی والدین.</p>
              <p>
                3- اصل و کپی کارت آمایش و گذرنامه ویژه دانش آموزان اتباع خارجی.
              </p>
              <p>
                4- چهار قطعه عکس 4*3 که در سال جاری گرفته شده پشت نویسی شده (نام
                و نام خانوادگی، نام پدر، کد ملی)
              </p>
              <p>5- اصل و کپی کارت ایثارگری ولی دانش آموز</p>
              <p>
                6- اصل و کپی کارت دانش آموزان تحت پوشش کمیته امداد و بهزیستی
              </p>
              <p>7- اصل نامه حضانت (ویژه والدین مطلقه)</p>
              <p>8- حکم کارگزینی برای والدین فرهنگی</p>
              <p className="mb-2 text-[#ffc107] text-[25px]">مدارک تحصیلی: </p>
              <p>1- اصل کارنامه ششم ابتدایی (الصاق تمبر، مهر و امضاء مدرسه)</p>
              <p>2- اصل کارنامه نهم (الصاق تمبر، مهر و امضاء مدرسه)</p>
              <p>
                3- اصل گواهینامه سه ساله متوسطه اول (الصاق تمبر، مهر و امضاء
                مدرسه)
              </p>
              <p>4- فرم هدایت تحصیلی (مهر و امضاء مدیر و مشاور مدرسه)</p>
              <p>
                5- کارت واکسن (مراجعه به پایگاه سلامت محل سکونت همراه شناسنامه)
              </p>
              <p>6- دفترچه سلامت.</p>
            </div>
            <div>
              <div className="flex justify-center py-8 font-MyFontTitre text-[30px]">
                <p className="text-[#dc3545]">تذکرات مهم:</p>
              </div>
              <p>
                1- ثبت نام قطعی در صورتی نهایی خواهد شد که مدارک کامل باشد، در
                غیر اینصورت فرایند ثبت نام معلق می شود.
              </p>
              <p>
                2- بعد از ثبت نام قطعی وارد سامانه{" "}
                <a
                  href="https://my.medu.ir/"
                  target="_blank"
                  className="text-[#0d6efd] text-[20px]"
                  title="سایت مدرسه"
                >
                  https://my.medu.ir
                </a>{" "}
                شده و در دبیرستان امام صادق (علیه السلام) ثبت نام نموده و منتظر
                مانده تا معاونت اجرایی دبیرستان شما را در سامانه سیدا تایید
                نماید.
              </p>
              <p className="mb-6">
                3- پس از تایید وارد سامانه کتب درسی شده و کتاب مربوط به رشته و
                پایه تحصیلی خود را ثبت نام کنید.
              </p>
              <p className="text-[#0dcaf0] text-xl mb-4">مرحله پایانی:</p>
            </div>
            <p className="text-[20px]">
              محل هایی که شما در روز مشخص شده برای ثبت نام قطعی باید مراجعه کنید
              به ترتیب:
            </p>
            <p>
              1- مراجعه به امور مالی دبیرستان واقع در طبقه فوقانی سالن مرکزی
              (سالن استاد فقیهی)و اخذ تاییدیه مالی.
              <span className="text-[#dc3545] text-[19px]">
                (کارت بانکی همراه داشته باشید)
              </span>
            </p>
            <p className="mb-6">
              2- مراجعه به معاونت آموزشی پایه دهم واقع در سالن شهید باهنر جهت
              تحویل مدارک و ثبت در سیستم و اتمام فرایند ثبت نام.
            </p>
          </div>
          <div className="flex justify-end my-8">
            <span>مدیریت دبیرستان ماندگار امام صادق (علیه السلام)</span>
          </div>
        </div>
        <div>
          <div className="my-12 flex justify-center text-[30px]">
            <p className="border-b-2 font-MyFontTitre border-[#198754] text-[#198754] font-bold">
              فرم ثبت نام
            </p>
          </div>
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
                    <p className="text-red-600 text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    نام خانوادگی:
                  </label>
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
                    <p className="text-red-600 text-sm mt-1">
                      {errors.lastName}
                    </p>
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
                    <p className="text-red-600 text-sm mt-1">
                      {errors.fatherName}
                    </p>
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
                    <p className="text-red-600 text-sm mt-1">
                      {errors.birthDate}
                    </p>
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
                        errors.birthPlace
                          ? "react-select-error"
                          : "react-select"
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
                    <p className="text-red-600 text-sm mt-1">
                      {errors.birthPlace}
                    </p>
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
                          borderColor: errors.grade
                            ? "#f87171"
                            : base.borderColor,
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
                          borderColor: errors.major
                            ? "#f87171"
                            : base.borderColor,
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
                  <label className="block mb-1 font-medium">
                    شماره شناسنامه:
                  </label>
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
                          errors.serialAlpha
                            ? "react-select-error"
                            : "react-select"
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
                        <p className="text-red-600 text-xs">
                          {errors.serialAlpha}
                        </p>
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
                    <p className="text-red-600 text-sm mt-1">
                      {errors.homeNumber}
                    </p>
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
                        errors.birthPlace
                          ? "react-select-error"
                          : "react-select"
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
                    <p className="text-red-600 text-sm mt-1">
                      {errors.birthPlace}
                    </p>
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
                  <label className="block mb-1 font-medium">
                    بارگذاری عکس:
                  </label>
                  <div className="flex flex-col w-full items-center md:items-start">
                    <div
                      className={`relative border-2 border-dashed rounded-md w-48 h-48 flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition overflow-hidden ${
                        imageError ? "border-red-500" : "border-gray-300"
                      }`}
                      onClick={() =>
                        fileInputRef.current && fileInputRef.current.click()
                      }
                      style={{ direction: "ltr" }}
                    >
                      {croppedImage ? (
                        <img
                          src={croppedImage}
                          alt="آپلود شده"
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
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
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="mt-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      حذف
                    </button>
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
                    <label className="block mb-1 font-medium">
                      نام خانوادگی:
                    </label>
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
                    <label className="block mb-1 font-medium">
                      شماره تماس:
                    </label>
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
                    <label className="block mb-1 font-medium">
                      کد ملی (پدر):
                    </label>
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
                    <label className="block mb-1 font-medium">
                      آدرس محل کار:
                    </label>
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
                    <label className="block mb-1 font-medium">
                      نام خانوادگی:
                    </label>
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
                    <label className="block mb-1 font-medium">
                      شماره تماس:
                    </label>
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
                    <label className="block mb-1 font-medium">
                      کد ملی (مادر):
                    </label>
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
                    <label className="block mb-1 font-medium">
                      آدرس محل کار:
                    </label>
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
                    onChange={handlePrevSchoolChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      prevSchoolError
                        ? "border-red-500 ring-red-400"
                        : "focus:ring-blue-400"
                    } ${inputDisabledClass}`}
                    disabled={formDisabled}
                  />
                  {prevSchoolError && (
                    <p className="text-red-600 text-sm mt-1">
                      {prevSchoolError}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-1 font-medium">
                    معدل کل سال قبل:
                  </label>
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
                      if (prevDisciplineError && value)
                        setPrevDisciplineError("");
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
                      className={`relative border-2 border-dashed rounded-md w-48 h-48 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition overflow-hidden ${
                        reportCardError ? "border-red-500" : "border-gray-300"
                      }`}
                      onClick={() =>
                        reportCardInputRef.current &&
                        reportCardInputRef.current.click()
                      }
                      style={{
                        direction: "ltr",
                        maxWidth: "100%",
                        maxHeight: "100%",
                      }}
                    >
                      {croppedReportCardImage ? (
                        <img
                          src={croppedReportCardImage}
                          alt="کارنامه آپلود شده"
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
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
                    <p className="text-red-600 text-sm mt-1">
                      {reportCardError}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="checkbox"
                    id="acceptFee"
                    className="custom-checkbox ml-2"
                    checked={acceptFee}
                    onChange={(e) => setAcceptFee(e.target.checked)}
                  />
                  <label htmlFor="acceptFee" className="text-sm select-none">
                    ضمن قبول پرداخت پنجاه میلیون ریال هزینه علی الحساب، مصوب
                    هیئت امنای دبیرستان، متقاضی ثبت نام می باشم
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
          <button
            onClick={fillDummyData}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            پر کردن فرم با داده‌های نمونه
          </button>
        </div>
      </div>
      {/*
      {croppedImage}
      */}
      {isCropModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg relative w-[90%] h-[80%] md:w-[70%] md:h-[70%]">
            <div className="relative w-full h-[70%]">
              <Cropper
                image={currentImageForCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                style={{ containerStyle: { width: "100%", height: "100%" } }}
              />
            </div>
            <div className="relative z-10 flex flex-col gap-4 mt-4">
              <div className="flex items-center gap-4">
                <label className="text-sm">زوم:</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-green-600"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="text-sm">چپ/راست:</label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="1"
                  value={crop.x}
                  onChange={(e) =>
                    setCrop({ ...crop, x: Number(e.target.value) })
                  }
                  className="w-full accent-blue-600"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="text-sm">بالا/پایین:</label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="1"
                  value={crop.y}
                  onChange={(e) =>
                    setCrop({ ...crop, y: Number(e.target.value) })
                  }
                  className="w-full accent-blue-600"
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={closeCropModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  لغو
                </button>
                <button
                  onClick={handleCropImage}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  برش
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isReportCardCropModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-2 sm:p-4 md:p-6 rounded shadow-lg relative w-[98vw] h-[90vh] sm:w-[90vw] sm:h-[80vh] md:w-[70vw] md:h-[70vh] max-w-2xl max-h-[90vh]">
            <div className="relative w-full h-[60vw] sm:h-[50vw] md:h-[60%] max-h-[60vh]">
              <Cropper
                image={currentReportCardForCrop}
                crop={reportCardCrop}
                zoom={reportCardCropZoom}
                aspect={1}
                onCropChange={setReportCardCrop}
                onZoomChange={setReportCardCropZoom}
                onCropComplete={setReportCardCroppedAreaPixels}
                style={{ containerStyle: { width: "100%", height: "100%" } }}
              />
            </div>
            <div className="relative z-10 flex flex-col gap-4 mt-4">
              <div className="flex items-center gap-4">
                <label className="text-sm">زوم:</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={reportCardCropZoom}
                  onChange={(e) =>
                    setReportCardCropZoom(Number(e.target.value))
                  }
                  className="w-full accent-green-600"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="text-sm">چپ/راست:</label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="1"
                  value={reportCardCrop.x}
                  onChange={(e) =>
                    setReportCardCrop({
                      ...reportCardCrop,
                      x: Number(e.target.value),
                    })
                  }
                  className="w-full accent-blue-600"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="text-sm">بالا/پایین:</label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="1"
                  value={reportCardCrop.y}
                  onChange={(e) =>
                    setReportCardCrop({
                      ...reportCardCrop,
                      y: Number(e.target.value),
                    })
                  }
                  className="w-full accent-blue-600"
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={closeReportCardCropModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  لغو
                </button>
                <button
                  onClick={handleCropReportCardImage}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  برش
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
export default MainOfMyPage;
