import React, { useState, useRef, useEffect } from "react";
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

// تابع فرمت مبلغ سه‌رقمی سه‌رقمی با اسلش
function formatNumberWithSlash(value) {
  if (!value) return "";
  const num = value.replace(/[^0-9]/g, "");
  if (!num) return "";
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, "/");
}

function MainOfMyPage() {
  // در MainOfMyPage.jsx، داخل کامپوننت MainOfMyPage
  // ... (state ها و سایر توابع)

  // تابع برای مدیریت تغییرات معدل
  const handlePrevAvgChange = (e) => {
    let value = e.target.value;

    // 1. فقط اعداد و نقطه را مجاز کنید.
    //   این RegEx اجازه می‌دهد:
    //   - شروع با 0-9
    //   - صفر یا یک نقطه
    //   - 0 تا 2 رقم بعد از نقطه
    //   - ^ برای شروع و $ برای پایان رشته است
    const regex = /^(?:[0-9]{1,2}(?:\.\d{0,2})?|20(?:\.0{0,2})?)$/; // این regex را اینجا تغییر می‌دهیم
    // این RegEx جدید کمی پیچیده‌تر است و تلاش می‌کند همزمان با تایپ،
    // محدودیت 0-20 و 2 رقم اعشار را هم اعمال کند.
    // ^\d*(\.\d{0,2})?$ اجازه 2 رقم اعشار می‌دهد.
    // برای محدودیت 0-20 در onChange: باید یک مقدار را پارس کنیم و بعد چک کنیم.
    // اما بهترین راه، چک کردن مرحله به مرحله است.

    // مرحله 1: فقط اعداد و نقطه را نگه دارید
    const filteredValue = value.replace(/[^0-9.]/g, ""); // فقط اعداد و نقطه

    // مرحله 2: مطمئن شوید فقط یک نقطه وجود دارد
    const parts = filteredValue.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join(""); // فقط اولین نقطه را نگه دارید
    }

    // مرحله 3: محدودیت دو رقم اعشار
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + "." + parts[1].substring(0, 2);
    } else {
      value = filteredValue; // اگر نقطه یا بیشتر از 2 رقم اعشار نبود، مقدار فیلتر شده را استفاده کنید
    }

    // مرحله 4: بررسی محدوده 0 تا 20 در حین تایپ (به صورت کلی)
    // این یک چک تقریبی است تا کاربر نتواند اعداد خیلی بزرگ وارد کند
    const numValue = parseFloat(value);
    if (value !== "" && !isNaN(numValue)) {
      if (numValue > 20) {
        // اگر عدد بزرگتر از 20 شد، اجازه ندهید وارد شود.
        // می‌توانیم آن را به 20 تغییر دهیم یا ورودی را نادیده بگیریم.
        // اینجا آن را به 20 محدود می‌کنیم تا کاربر راحت‌تر باشد.
        if (prevAvg === "20") {
          // جلوگیری از لوپ بی نهایت اگر کاربر بخواهد 20.000000 را تایپ کند
          setPrevAvg(value); // فقط اگر واقعا تغییری هست
        } else {
          setPrevAvg("20");
        }
      } else {
        setPrevAvg(value);
      }
    } else {
      setPrevAvg(value); // اجازه دهید رشته‌های خالی یا '0.' وارد شوند
    }

    // پاک کردن ارور در زمان تایپ (اگر معتبر باشد)
    // ارور در اینجا به صورت کلی پاک می شود
    if (value.trim() !== "") {
      setPrevAvgError("");
    }
  };

  // تابع برای مدیریت تغییرات نمره انضباط (مشابه معدل)
  const handlePrevDisciplineChange = (e) => {
    let value = e.target.value;

    // مرحله 1: فقط اعداد و نقطه را نگه دارید
    const filteredValue = value.replace(/[^0-9.]/g, "");

    // مرحله 2: مطمئن شوید فقط یک نقطه وجود دارد
    const parts = filteredValue.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    // مرحله 3: محدودیت دو رقم اعشار
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + "." + parts[1].substring(0, 2);
    } else {
      value = filteredValue;
    }

    // مرحله 4: بررسی محدوده 0 تا 20 در حین تایپ
    const numValue = parseFloat(value);
    if (value !== "" && !isNaN(numValue)) {
      if (numValue > 20) {
        if (prevDiscipline === "20") {
          setPrevDiscipline(value);
        } else {
          setPrevDiscipline("20");
        }
      } else {
        setPrevDiscipline(value);
      }
    } else {
      setPrevDiscipline(value);
    }

    // پاک کردن ارور در زمان تایپ
    if (value.trim() !== "") {
      setPrevDisciplineError("");
    }
  };

  // ... (بقیه کد)
  // For two-stage submission
  const [isReviewMode, setIsReviewMode] = useState(false); // اگر true باشد، فرم در حالت مرور و غیرقابل ویرایش است
  const [isSubmitting, setIsSubmitting] = useState(false); // اگر true باشد، فرم در حال ارسال نهایی به بک‌اند است (دکمه سابمیت غیرفعال می‌شود)
  // Removed all vaccine-related state and refs
  const reportCardInputRef = useRef(); // Still needed for report card

  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [formDisabled, setFormDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [zoom, setZoom] = useState(1);
  const [imageError, setImageError] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null); // Stores the Blob for personal photo
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [currentImageForCrop, setCurrentImageForCrop] = useState(null); // URL for personal photo cropper

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
  const [prevSchoolError, setPrevSchoolError] = useState("");
  const [prevAvgError, setPrevAvgError] = useState("");

  const [errors, setErrors] = useState({});
  const [reportCardError, setReportCardError] = useState("");

  // Report card specific states
  const [reportCardFile, setReportCardFile] = useState(null); // Stores the Blob for submission
  const [reportCardImage, setReportCardImage] = useState(null); // Stores the URL for display
  const [isReportCardCropModalOpen, setIsReportCardCropModalOpen] =
    useState(false);
  const [currentReportCardForCrop, setCurrentReportCardForCrop] =
    useState(null); // Image URL for the cropper
  const [reportCardCrop, setReportCardCrop] = useState({ x: 0, y: 0 });
  const [reportCardCropZoom, setReportCardCropZoom] = useState(1);
  const [reportCardCroppedAreaPixels, setReportCardCroppedAreaPixels] =
    useState(null);

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

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);

  const [showPaymentRulesModal, setShowPaymentRulesModal] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [checkboxEnabled, setCheckboxEnabled] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentFields, setPaymentFields] = useState({
    initial: "50000000",
    total: "100000000",
    installment1: "",
    date1: "",
    date1Obj: null,
    check1: "",
    bank1: "",
    installment2: "",
    date2: "",
    date2Obj: null,
    check2: "",
    bank2: "",
    installment3: "",
    date3: "",
    date3Obj: null,
    check3: "",
    bank3: "",
  });

  const [paymentErrors, setPaymentErrors] = useState({
    initial: "",
    installments: "",
    date1: "",
    date2: "",
    date3: "",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // state جدید برای مدال خطا
  const [showPaymentErrorModal, setShowPaymentErrorModal] = useState(false);
  const [paymentErrorModalMessage, setPaymentErrorModalMessage] = useState("");

  const validatePaymentFields = () => {
    const initial = parseInt(paymentFields.initial) || 0;
    const installment1 = parseInt(paymentFields.installment1) || 0;
    const installment2 = parseInt(paymentFields.installment2) || 0;
    const installment3 = parseInt(paymentFields.installment3) || 0;
    const total = parseInt(paymentFields.total);
    const totalInstallments = installment1 + installment2 + installment3;

    let isValid = true;
    const errors = {};

    // بررسی پرداخت اولیه
    if (initial < 50000000 || initial > 100000000) {
      errors.initial = "مبلغ پرداخت اولیه باید بین ۵۰ تا ۱۰۰ میلیون ریال باشد";
      isValid = false;
    }

    // بررسی مجموع اقساط
    if (totalInstallments !== total - initial) {
      errors.installments = "مجموع اقساط باید با مبلغ باقیمانده برابر باشد";
      isValid = false;
    }

    // بررسی تاریخ‌های اقساط
    if (
      installment1 > 0 &&
      (!paymentFields.date1 || paymentFields.date1.trim() === "")
    ) {
      errors.date1 = "برای قسط اول که مبلغ وارد شده، تاریخ هم باید وارد شود";
      isValid = false;
    }
    if (
      installment2 > 0 &&
      (!paymentFields.date2 || paymentFields.date2.trim() === "")
    ) {
      errors.date2 = "برای قسط دوم که مبلغ وارد شده، تاریخ هم باید وارد شود";
      isValid = false;
    }
    if (
      installment3 > 0 &&
      (!paymentFields.date3 || paymentFields.date3.trim() === "")
    ) {
      errors.date3 = "برای قسط سوم که مبلغ وارد شده، تاریخ هم باید وارد شود";
      isValid = false;
    }

    setPaymentErrors(errors);
    return { isValid, errors };
  };

  const handleInitialPaymentChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPaymentFields((f) => ({ ...f, initial: value }));
  };

  const handleInstallmentChange = (e, field) => {
    let value = e.target.value;
    if (field === "bank1" || field === "bank2" || field === "bank3") {
      // فقط فاصله‌های اضافی ابتدا و انتها را حذف کن، حروف و عدد مجاز است
      value = value.trimStart();
    } else {
      value = value.replace(/[^0-9]/g, "");
    }
    setPaymentFields((f) => ({ ...f, [field]: value }));
  };

  // تابع برای ارسال نهایی اطلاعات به بک‌اند
  const handleFinalSubmit = async () => {
    if (grade && (grade.value === "10" || grade === "دهم")) {
      setFormDisabled(true);
      setShowPaymentRulesModal(true);
      setCountdown(1);
      setCheckboxEnabled(false);
      setChecked(false);
      return; // Don't submit yet, wait for modal
    }
    // اگر پایه یازدهم یا دوازدهم بود
    if (
      grade &&
      (grade.value === "11" ||
        grade.value === "12" ||
        grade === "یازدهم" ||
        grade === "دوازدهم")
    ) {
      // آماده‌سازی داده‌ها
      const formData = new FormData();
      formData.append("st_fname", firstName);
      formData.append("st_lname", lastName);
      formData.append("st_faname", fatherName);
      formData.append("st_id_no", nationalCode);
      formData.append("st_birthdate", birthDate);
      formData.append("st_birthplace", birthPlace?.value || "");
      formData.append("st_id_card_exportion", iranSodoor?.value || "");
      formData.append("st_grade", grade.value);
      formData.append("st_field", major?.value || "");
      formData.append(
        "st_series",
        `${serialAlpha.value}${serialNumber}${serialNumber2}`
      );
      formData.append("st_phone", contactNumber);
      formData.append("st_home_phone", homeNumber);
      formData.append("st_address", address);
      formData.append("fa_fname", parentFirstName);
      formData.append("fa_lname", parentLastName);
      formData.append("fa_job", parentJob);
      formData.append("fa_phone", parentContact);
      formData.append("fa_id_no", parentNationalCode);
      formData.append("fa_education", parentEducation);
      formData.append("fa_work_address", parentWorkAddress);
      formData.append("mo_fname", motherFirstName);
      formData.append("mo_lname", motherLastName);
      formData.append("mo_job", motherJob);
      formData.append("mo_phone", motherContact);
      formData.append("mo_id_no", motherNationalCode);
      formData.append("mo_education", motherEducation);
      formData.append("mo_work_address", motherWorkAddress);
      formData.append("last_school", prevSchool);
      formData.append("last_avrage", prevAvg);
      formData.append("last_enzebat", prevDiscipline);
      if (croppedImage) {
        formData.append("st_personal_pic", croppedImage, "student_image.png");
      }
      if (reportCardFile) {
        formData.append("last_karname", reportCardFile, "report_card.png");
      }
      setIsSubmitting(true);
      try {
        await axios.post(
          "https://mandegarhs.ir/amoozyar2/api/students/register",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setShowSuccessModal(true);
      } catch (error) {
        alert("خطا در ثبت اطلاعات! لطفا دوباره تلاش کنید.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    setIsSubmitting(true);
    setIsReviewMode(false);

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("nationalId", nationalCode);
    formData.append(
      "birthDate",
      birthDate ? birthDate.format("YYYY/MM/DD") : ""
    );
    formData.append("phoneNumber", contactNumber);
    formData.append("fatherName", fatherName);
    formData.append("fatherNationalId", parentNationalCode);
    formData.append("fatherPhoneNumber", parentContact);
    formData.append("motherNationalId", motherNationalCode);
    formData.append("motherPhoneNumber", motherContact);
    formData.append("issuePlace", address);
    formData.append("address", address);
    formData.append("grade", grade);
    formData.append("major", major);
    formData.append("alefOption", serialAlpha);
    formData.append("prevSchool", prevSchool);
    formData.append("prevAvg", prevAvg);
    formData.append("last_enzebat", prevDiscipline);

    if (reportCardFile) {
      formData.append("reportCard", reportCardFile);
    }

    try {
      alert("فرم با موفقیت ثبت شد!");
      // اینجا می‌توانید فرم را بعد از ارسال موفقیت‌آمیز ریست کنید
      // resetFormStates();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("خطا در ثبت فرم. لطفاً دوباره تلاش کنید.");
      // اگر ارسال با شکست مواجه شد، می‌توانید کاربر را به حالت مرور بازگردانید تا دوباره تلاش کند
      setIsReviewMode(true);
    } finally {
      setIsSubmitting(false); // دکمه ثبت را دوباره فعال کن
    }
  };

  useEffect(() => {
    let timer;
    if (showPaymentRulesModal && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (showPaymentRulesModal && countdown === 0) {
      setCheckboxEnabled(true);
    }
    return () => clearTimeout(timer);
  }, [showPaymentRulesModal, countdown]);

  useEffect(() => {
    let closeTimer;
    if (checked && showPaymentRulesModal) {
      closeTimer = setTimeout(() => {
        setShowPaymentRulesModal(false);
        setShowPaymentForm(true);
        setIsSubmitting(true);
        setIsReviewMode(false);
        // ... rest of your submit logic ...
      }, 2000);
    }
    return () => clearTimeout(closeTimer);
  }, [checked, showPaymentRulesModal]);

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
      console.error("No file selected for personal image.");
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
    setCroppedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropImage = async () => {
    if (!currentImageForCrop || !croppedAreaPixels) {
      console.error("No image or crop area for personal image.");
      return;
    }
    try {
      const croppedImgBlob = await getCroppedImg(
        currentImageForCrop,
        croppedAreaPixels
      );
      setCroppedImage(croppedImgBlob); // This is a Blob/File object
      closeCropModal();
    } catch (error) {
      console.error("Error cropping personal image:", error);
    }
  };

  // --- Report Card Functions ---

  // Function to open the report card cropping modal
  const openReportCardCropModal = (imageUrl) => {
    setCurrentReportCardForCrop(imageUrl);
    setIsReportCardCropModalOpen(true);
    setReportCardCroppedAreaPixels(null); // Reset crop area when opening
    setReportCardCrop({ x: 0, y: 0 }); // Reset crop position
    setReportCardCropZoom(1); // Reset zoom
  };

  // Function to handle report card file selection
  const handleReportCardFileChange = (event) => {
    setReportCardError(""); // خطاهای قبلی رو پاک کن
    const file = event.target.files[0];

    if (file) {
      // **مرحله جدید: اعتبارسنجی حجم فایل**
      const MAX_FILE_SIZE_KB = 150;
      const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_KB * 1024; // 150 کیلوبایت به بایت

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setReportCardError(
          `حجم فایل بیشتر از ${MAX_FILE_SIZE_KB} کیلوبایت است. لطفاً فایل کوچکتری انتخاب کنید.`
        );
        // فایل اینپوت رو ریست کن تا کاربر مجبور بشه فایل دیگه‌ای انتخاب کنه
        event.target.value = null;
        setReportCardFile(null);
        setReportCardImage(null);
        setCurrentReportCardForCrop(null);
        return; // از ادامه اجرای تابع جلوگیری کن
      }

      // **باقی کدهای موجود شما برای خواندن فایل**
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentReportCardForCrop(reader.result);
        setIsReportCardCropModalOpen(true);
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        setReportCardError("خطا در خواندن فایل تصویر کارنامه.");
      };
      reader.readAsDataURL(file);
    } else {
      // اگر کاربر فایلی انتخاب نکرد یا کنسل کرد
      setReportCardFile(null);
      setReportCardImage(null);
      setCurrentReportCardForCrop(null);
    }
  };

  // Function to handle cropping the report card image
  const handleCropReportCardImage = async () => {
    console.log("Current image:", currentReportCardForCrop);
    console.log("Crop area:", reportCardCroppedAreaPixels);

    if (!currentReportCardForCrop) {
      console.error("هیچ تصویری برای برش انتخاب نشده است");
      setReportCardError("هیچ تصویری برای برش انتخاب نشده است.");
      return;
    }

    if (!reportCardCroppedAreaPixels) {
      console.error("ناحیه برش مشخص نشده است");
      setReportCardError("ناحیه برش مشخص نشده است.");
      return;
    }

    try {
      const croppedImgBlob = await getCroppedImg(
        // نام متغیر را تغییر دادیم برای وضوح بیشتر
        currentReportCardForCrop,
        reportCardCroppedAreaPixels
      );

      // Explicitly check if croppedImgBlob is an instance of Blob before using it
      if (croppedImgBlob instanceof Blob) {
        setReportCardFile(croppedImgBlob);
        setReportCardImage(URL.createObjectURL(croppedImgBlob)); // 👈 اینجا از setReportCardImage استفاده کنید
        closeReportCardCropModal();
        setReportCardError(""); // Clear any previous errors on success
      } else {
        console.error(
          "getCroppedImg یک Blob معتبر برنگردانده است:",
          croppedImgBlob
        );
        setReportCardError(
          "خطا در پردازش تصویر کارنامه. لطفاً دوباره تلاش کنید."
        );
        closeReportCardCropModal();
      }
    } catch (error) {
      console.error("خطا در برش تصویر کارنامه:", error);
      setReportCardError("خطا در برش تصویر کارنامه: " + error.message);
      closeReportCardCropModal();
    }
  };

  const closeReportCardCropModal = () => {
    setIsReportCardCropModalOpen(false);
    setCurrentReportCardForCrop(null); // Clear the image for crop
  };

  const onReportCardCropComplete = (croppedArea, croppedAreaPixels) => {
    setReportCardCroppedAreaPixels(croppedAreaPixels);
  };

  const handleRemoveReportCard = () => {
    setReportCardFile(null);
    setReportCardImage(null); // Clear the displayed image
    setReportCardCropZoom(1);
    setReportCardCrop({ x: 0, y: 0 });
    setReportCardCroppedAreaPixels(null);
    if (reportCardInputRef.current) {
      reportCardInputRef.current.value = null; // Clear the file input
    }
  };

  const handlePersianInput = (setter) => (e) => {
    let value = e.target.value;
    const regex = /^[\u0600-\u06FF\s]*$/;
    if (!regex.test(value)) return;
    if (value.startsWith(" ")) return;
    if (value.includes("  ")) return;
    setter(value);
  };

  const handleNumberInput =
    (setter, maxLength = null) =>
    (e) => {
      let value = e.target.value;
      value = value.replace(/[^0-9]/g, "");
      if (maxLength) value = value.slice(0, maxLength);
      setter(value);
    };

  const handleFinalSubmitAfterConfirm = async () => {
    setShowConfirmationModal(false);
    setShowContinueButton(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Console.log ها برای عیب یابی (همچنان مفید هستند)
    console.log("مقدار grade در زمان سابمیت:", grade);
    console.log("مقدار prevSchool در زمان سابمیت:", prevSchool);

    let tempErrors = {}; // آبجکت موقت برای جمع آوری همه خطاها

    // ... (سایر اعتبارسنجی ها)

    // اعتبارسنجی معدل
    const prevAvgValue = prevAvg.trim();
    const parsedPrevAvg = parseFloat(prevAvgValue);

    if (prevAvgValue === "") {
      tempErrors.prevAvg = "معدل را وارد کنید";
    } else if (
      isNaN(parsedPrevAvg) ||
      !/^\d+(\.\d{1,2})?$/.test(prevAvgValue)
    ) {
      // RegEx جدید برای بررسی اینکه فقط عدد و حداکثر دو رقم اعشار است
      tempErrors.prevAvg = "معدل نامعتبر است (فقط عدد و حداکثر دو رقم اعشار).";
    } else if (parsedPrevAvg < 0 || parsedPrevAvg > 20) {
      tempErrors.prevAvg = "معدل باید بین ۰ تا ۲۰ باشد.";
    }

    // ******* اعتبارسنجی نمره انضباط (پیشرفته‌تر) ********
    const prevDisciplineValue = prevDiscipline.trim();
    const parsedPrevDiscipline = parseFloat(prevDisciplineValue);

    if (prevDisciplineValue === "") {
      tempErrors.prevDiscipline = "نمره انضباط را وارد کنید";
    } else if (
      isNaN(parsedPrevDiscipline) ||
      !/^\d+(\.\d{1,2})?$/.test(prevDisciplineValue)
    ) {
      // RegEx جدید برای بررسی اینکه فقط عدد و حداکثر دو رقم اعشار است
      tempErrors.prevDiscipline =
        "نمره انضباط نامعتبر است (فقط عدد و حداکثر دو رقم اعشار).";
    } else if (parsedPrevDiscipline < 0 || parsedPrevDiscipline > 20) {
      tempErrors.prevDiscipline = "نمره انضباط باید بین ۰ تا ۲۰ باشد.";
    }
    // ********** بخش اعتبارسنجی (همانند اصلاح قبلی که دادم) **********
    // اعتبارسنجی فیلدهای شخصی
    if (!firstName) tempErrors.firstName = "نام را وارد کنید";
    if (!lastName) tempErrors.lastName = "نام خانوادگی را وارد کنید";
    if (!fatherName) tempErrors.fatherName = "نام پدر را وارد کنید";
    if (!nationalCode) tempErrors.nationalCode = "شماره ملی را وارد کنید";
    else if (nationalCode.length !== 10)
      tempErrors.nationalCode = "شماره ملی نامعتبر است";
    if (!birthDate) tempErrors.birthDate = "تاریخ تولد را وارد کنید";
    if (!birthPlace?.value) tempErrors.birthPlace = "محل تولد را انتخاب کنید";
    if (!grade || grade.value === "")
      tempErrors.grade = "پایه تحصیلی را انتخاب کنید";
    if (!major?.value) tempErrors.major = "رشته تحصیلی را انتخاب کنید";
    if (!serialAlpha?.value)
      tempErrors.serialAlpha = "حرف الف سریال را انتخاب کنید";
    if (!serialNumber)
      tempErrors.serialNumber = "بخش اول سریال شناسنامه را وارد کنید";
    else if (serialNumber.length !== 6)
      tempErrors.serialNumber = "باید ۶ رقم باشد";
    if (!serialNumber2)
      tempErrors.serialNumber2 = "بخش دوم سریال شناسنامه را وارد کنید";
    else if (serialNumber2.length !== 2)
      tempErrors.serialNumber2 = "باید ۲ رقم باشد";
    if (!contactNumber) tempErrors.contactNumber = "شماره تماس را وارد کنید";
    else if (contactNumber.length !== 11)
      tempErrors.contactNumber = "باید ۱۱ رقم باشد";
    if (!homeNumber) tempErrors.homeNumber = "شماره منزل را وارد کنید";
    else if (homeNumber.length !== 11)
      tempErrors.homeNumber = "باید ۱۱ رقم باشد";

    // اعتبارسنجی آدرس (از trim() استفاده کنید)
    if (address.trim() === "")
      tempErrors.address = "وارد کردن آدرس الزامی است.";

    // اعتبارسنجی عکس (مستقیم در tempErrors)
    if (!croppedImage) tempErrors.croppedImage = "آپلود عکس الزامی است.";

    // اعتبارسنجی والدین (پدر) - مستقیم در tempErrors
    if (!parentFirstName) tempErrors.parentFirstName = "نام پدر را وارد کنید";
    if (!parentLastName)
      tempErrors.parentLastName = "نام خانوادگی را وارد کنید";
    if (!parentJob) tempErrors.parentJob = "شغل را وارد کنید";
    if (!parentContact) tempErrors.parentContact = "شماره تماس را وارد کنید";
    else if (parentContact.length !== 11)
      tempErrors.parentContact = "باید ۱۱ رقم باشد";
    if (!parentNationalCode)
      tempErrors.parentNationalCode = "کد ملی پدر را وارد کنید";
    if (!parentEducation) tempErrors.parentEducation = "تحصیلات را وارد کنید";
    if (!parentWorkAddress)
      tempErrors.parentWorkAddress = "آدرس محل کار را وارد کنید";

    // اعتبارسنجی والدین (مادر) - مستقیم در tempErrors
    if (!motherFirstName) tempErrors.motherFirstName = "نام مادر را وارد کنید";
    if (!motherLastName)
      tempErrors.motherLastName = "نام خانوادگی مادر را وارد کنید";
    if (!motherJob) tempErrors.motherJob = "شغل مادر را وارد کنید";
    if (!motherContact)
      tempErrors.motherContact = "شماره تماس مادر را وارد کنید";
    else if (motherContact.length !== 11)
      tempErrors.motherContact = "باید ۱۱ رقم باشد";
    if (!motherNationalCode)
      tempErrors.motherNationalCode = "کد ملی مادر را وارد کنید";
    if (!motherEducation)
      tempErrors.motherEducation = "تحصیلات مادر را وارد کنید";
    if (!motherWorkAddress)
      tempErrors.motherWorkAddress = "آدرس محل کار مادر را وارد کنید";

    // اعتبارسنجی جزئیات تحصیلی (Edu) - مستقیم در tempErrors
    if (prevSchool.trim() === "")
      tempErrors.prevSchool = "مدرسه قبلی را وارد کنید";
    if (prevAvg.trim() === "") tempErrors.prevAvg = "معدل را وارد کنید";
    if (prevDiscipline.trim() === "")
      tempErrors.prevDiscipline = "نمره انضباط را وارد کنید";

    // اعتبارسنجی کارنامه (مستقیم در tempErrors)
    if (!reportCardFile)
      tempErrors.reportCardFile = "آپلود کارنامه الزامی است.";

    // ********** پایان بخش اعتبارسنجی **********

    // Console.log نهایی برای دیدن همه خطاها در tempErrors (بسیار مهم برای دیباگ)
    console.log("تمام خطاهای جمع آوری شده در tempErrors:", tempErrors);

    // حالا تمام خطاهای جمع آوری شده را به state های مربوطه منتقل می‌کنیم
    // این مرحله حیاتی است تا JSX بتواند خطاها را ببیند
    setErrors({
      firstName: tempErrors.firstName || "",
      lastName: tempErrors.lastName || "",
      fatherName: tempErrors.fatherName || "",
      nationalCode: tempErrors.nationalCode || "",
      birthDate: tempErrors.birthDate || "",
      birthPlace: tempErrors.birthPlace || "",
      grade: tempErrors.grade || "",
      major: tempErrors.major || "",
      serialAlpha: tempErrors.serialAlpha || "",
      serialNumber: tempErrors.serialNumber || "",
      serialNumber2: tempErrors.serialNumber2 || "",
      contactNumber: tempErrors.contactNumber || "",
      homeNumber: tempErrors.homeNumber || "",
    });

    setAddressError(tempErrors.address || "");
    setImageError(tempErrors.croppedImage || "");
    setReportCardError(tempErrors.reportCardFile || ""); // این خط را بررسی کنید، آیا این state وجود دارد؟

    setParentErrors({
      parentFirstName: tempErrors.parentFirstName || "",
      parentLastName: tempErrors.parentLastName || "",
      parentJob: tempErrors.parentJob || "",
      parentContact: tempErrors.parentContact || "",
      parentNationalCode: tempErrors.parentNationalCode || "",
      parentEducation: tempErrors.parentEducation || "",
      parentWorkAddress: tempErrors.parentWorkAddress || "",
    });

    setMotherErrors({
      motherFirstName: tempErrors.motherFirstName || "",
      motherLastName: tempErrors.motherLastName || "",
      motherJob: tempErrors.motherJob || "",
      motherContact: tempErrors.motherContact || "",
      motherNationalCode: tempErrors.motherNationalCode || "",
      motherEducation: tempErrors.motherEducation || "",
      motherWorkAddress: tempErrors.motherWorkAddress || "",
    });

    setPrevSchoolError(tempErrors.prevSchool || "");
    setPrevAvgError(tempErrors.prevAvg || "");
    setPrevDisciplineError(tempErrors.prevDiscipline || "");

    // بررسی نهایی برای وجود هرگونه خطا
    // فقط کافیست چک کنید که tempErrors خالی نیست
    if (Object.keys(tempErrors).length > 0) {
      // پیدا کردن اولین کلید خطا در tempErrors
      const firstErrorKey = Object.keys(tempErrors)[0];

      let targetElement = null;

      // اینجا باید منطق پیدا کردن المان هدف را بر اساس firstErrorKey پیاده سازی کنید
      // اگر از refs استفاده می‌کنید:
      if (refs[firstErrorKey] && refs[firstErrorKey].current) {
        targetElement = refs[firstErrorKey].current;
      } else {
        // برای خطاهایی که ref ندارند یا با ID پیدا می‌شوند
        switch (firstErrorKey) {
          case "address":
            targetElement = document.querySelector(
              'input[value="' + address + '"]'
            ); // این ممکن است دقیق نباشد
            // بهتر است یک id منحصر به فرد به فیلد آدرس بدهید و از getElementById استفاده کنید.
            // مثلا: <input id="addressField" ... />
            // targetElement = document.getElementById("addressField");
            break;
          case "croppedImage":
            targetElement = document.getElementById("imageUpload");
            break;
          case "reportCardFile":
            targetElement = document.getElementById("reportCardUpload");
            break;
          case "acceptFee": // اگر این خطا هم در tempErrors ذخیره شود
            targetElement = document.getElementById("acceptFee");
            break;
          // ... موارد دیگر
          default:
            // اگر هیچ ref یا id خاصی برای این خطا پیدا نشد، به اولین p.text-red-600 اسکرول کنید
            targetElement = document.querySelector(".text-red-600");
            break;
        }
      }

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "center", // 'center' یا 'start' یا 'nearest'
        });
      }

      return; // از ارسال فرم جلوگیری کنید
    }

    // اگر همه اعتبارسنجی‌ها پاس شد، به جای ارسال مستقیم، مدال را نمایش بده
    setShowConfirmationModal(true);
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
    setBirthDate("2005/03/15");
    setBirthDateObj(new Date(2005, 2, 15));
    setBirthPlace("تهران");
    setIranSodoor(iransodoor.find((sodoor) => sodoor.value === "تهران"));
    setGrade(grades[0]);
    setMajor(majors.find((major) => major.value === "ریاضی"));
    setSerialAlpha(alefOptions.find((opt) => opt.value === "الف"));
    setSerialNumber("123456"); // Dummy data for 6 digits
    setSerialNumber2("78"); // Dummy data for 2 digits
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
    // For images, you'd need to mock croppedImage and reportCardImage as base64 or blob URLs for dummy data
    // setCroppedImage(new Blob(["dummy image data"], { type: "image/jpeg" }));
    // setReportCardFile(new Blob(["dummy report card data"], { type: "image/jpeg" }));
    // setReportCardImage(URL.createObjectURL(new Blob(["dummy report card data"], { type: "image/jpeg" })));
  };

  const handlePrevSchoolChange = (e) => {
    const value = e.target.value;
    setPrevSchool(value);
    if (value.trim() !== "") {
      setPrevSchoolError("");
    }
  };

  // تنظیم محدوده تاریخ‌ها
  const minDate = new Date(2025, 6, 6); // 15 تیر 1404
  const maxDate = new Date(2026, 5, 22); // 31 خرداد 1405

  // تابع هندل ثبت نام و پرداخت
  const handlePaymentSubmit = async (e) => {
    if (e) e.preventDefault();
    const { isValid, errors } = validatePaymentFields();
    if (!isValid) {
      if (errors.date1) {
        setPaymentErrorModalMessage(errors.date1);
        setShowPaymentErrorModal(true);
        return;
      }
      if (errors.date2) {
        setPaymentErrorModalMessage(errors.date2);
        setShowPaymentErrorModal(true);
        return;
      }
      if (errors.date3) {
        setPaymentErrorModalMessage(errors.date3);
        setShowPaymentErrorModal(true);
        return;
      }
      if (errors.installments) {
        setPaymentErrorModalMessage(errors.installments);
        setShowPaymentErrorModal(true);
        return;
      }
      return;
    }

    // اگر پایه دهم انتخاب شده بود، اطلاعات را مانند یازدهم و دوازدهم به API ارسال کن
    if (grade && (grade.value === "10" || grade === "دهم")) {
      // آماده‌سازی داده‌ها
      const formData = new FormData();
      formData.append("st_fname", firstName);
      formData.append("st_lname", lastName);
      formData.append("st_faname", fatherName);
      formData.append("st_id_no", nationalCode);
      formData.append("st_birthdate", birthDate);
      formData.append("st_birthplace", birthPlace?.value || "");
      formData.append("st_id_card_exportion", iranSodoor?.value || "");
      formData.append("st_grade", grade.value);
      formData.append("st_field", major?.value || "");
      formData.append(
        "st_series",
        `${serialAlpha?.value || ""}${serialNumber}${serialNumber2}`
      );
      formData.append("st_phone", contactNumber);
      formData.append("st_home_phone", homeNumber);
      formData.append("st_address", address);
      formData.append("fa_fname", parentFirstName);
      formData.append("fa_lname", parentLastName);
      formData.append("fa_job", parentJob);
      formData.append("fa_phone", parentContact);
      formData.append("fa_id_no", parentNationalCode);
      formData.append("fa_education", parentEducation);
      formData.append("fa_work_address", parentWorkAddress);
      formData.append("mo_fname", motherFirstName);
      formData.append("mo_lname", motherLastName);
      formData.append("mo_job", motherJob);
      formData.append("mo_phone", motherContact);
      formData.append("mo_id_no", motherNationalCode);
      formData.append("mo_education", motherEducation);
      formData.append("mo_work_address", motherWorkAddress);
      formData.append("last_school", prevSchool);
      formData.append("last_avrage", prevAvg);
      formData.append("last_enzebat", prevDiscipline);
      if (croppedImage) {
        formData.append("st_personal_pic", croppedImage, "student_image.png");
      }
      if (reportCardFile) {
        formData.append("last_karname", reportCardFile, "report_card.png");
      }
      try {
        await axios.post(
          "https://mandegarhs.ir/amoozyar2/api/students/register",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setShowSuccessModal(true);
      } catch (error) {
        alert("خطا در ثبت اطلاعات! لطفا دوباره تلاش کنید.");
      }
      return;
    }
    // ... سایر پایه‌ها (یازدهم و دوازدهم و ...)
  };

  return (
    <main className="max-w-screen-lg mx-auto p-6 relative">
      <div className="flex justify-center my-16">
        <p className="main-title-of-page">سامانه ثبت نام</p>
      </div>
      <div className="parentOfform">
        <div>
          <div className="flex flex-col items-center mb-4 text-[25px]">
            <p>به نام خدا</p>
            <p>مراحل ثبت نام پایه دهم سال تحصیلی ۱۴۰۵-۱۴۰۴</p>
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
                    دوشنبه ۸، سه‌شنبه ۹ و چهارشنبه ۱۰ مرداد ۱۴۰۳
                  </td>
                </tr>
                <tr className="bg-[#ffc107]">
                  <td className="text-right rounded-r-xl">ریاضی</td>
                  <td className="text-center rounded-l-xl">
                    شنبه ۱۳، یکشنبه ۱۴ و دوشنبه ۱۵ مرداد ۱۴۰۳
                  </td>
                </tr>
                <tr className="bg-[#0d6efd]">
                  <td className="text-right rounded-r-xl">انسانی و معارف</td>
                  <td className="text-center rounded-l-xl">
                    سه‌شنبه ۱۶ مرداد ۱۴۰۳
                  </td>
                </tr>
                <tr className="bg-[#dc3545]">
                  <td className="text-right rounded-r-xl">
                    ذخیره‌ها (در صورت نیاز)
                  </td>
                  <td className="text-center rounded-l-xl">
                    چهارشنبه ۱۷ و پنجشنبه ۱۸ مرداد ۱۴۰۳
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
              {/* Removed Vaccine Card mention */}
              {/* <p>5- کارت واکسن (مراجعه به پایگاه سلامت محل سکونت همراه شناسنامه)</p> */}
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
                  اطلاعات باموفقیت ثبت شد.لطفا مجددا اطلاعات خود را چک کنید ،در
                  صورت وجود مشکل دکمه (ویرایش اطلاعات) واقع در بالای فرم را
                  بزنید و در صورت نبود مشکل مجددا بر روی دکمه ثبت نام موقت کلید
                  کنید.
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
                        readOnly
                        value={birthDate}
                        placeholder="انتخاب تاریخ"
                        className={`w-full h-20 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-gray-50 cursor-pointer ${
                          errors.birthDate
                            ? "border-red-500 ring-red-400"
                            : "focus:ring-blue-400"
                        } ${inputDisabledClass}`}
                        style={{ height: "40px" }}
                        onKeyDown={(e) => e.preventDefault()}
                        onPaste={(e) => e.preventDefault()}
                        onInput={(e) => e.preventDefault()}
                        onKeyPress={(e) => e.preventDefault()}
                        onKeyUp={(e) => e.preventDefault()}
                        onCompositionStart={(e) => e.preventDefault()}
                        onCompositionEnd={(e) => e.preventDefault()}
                        onCompositionUpdate={(e) => e.preventDefault()}
                        onBeforeInput={(e) => e.preventDefault()}
                        onSelect={(e) => e.preventDefault()}
                        onCut={(e) => e.preventDefault()}
                        onCopy={(e) => e.preventDefault()}
                        onDrag={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                        onDrop={(e) => e.preventDefault()}
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
                    {" "}
                    سریال شناسنامه:{" "}
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      ref={refs.serialNumber}
                      type="text"
                      maxLength={6}
                      value={serialNumber}
                      onChange={handleNumberInput(setSerialNumber, 6)}
                      className={`w-16 text-center py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.serialNumber
                          ? "border-red-500 ring-red-400"
                          : "focus:ring-blue-400"
                      } ${inputDisabledClass}`}
                      disabled={formDisabled}
                      placeholder="123456"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      ref={refs.serialNumber2}
                      type="text"
                      maxLength={2}
                      value={serialNumber2}
                      onChange={handleNumberInput(setSerialNumber2, 2)}
                      className={`w-16 text-center py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.serialNumber2
                          ? "border-red-500 ring-red-400"
                          : "focus:ring-blue-400"
                      } ${inputDisabledClass}`}
                      disabled={formDisabled}
                      placeholder="12"
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
                          {" "}
                          {errors.serialNumber}{" "}
                        </p>
                      )}
                    </div>
                    <div className="w-16">
                      {errors.serialNumber2 && (
                        <p className="text-red-600 text-xs">
                          {" "}
                          {errors.serialNumber2}{" "}
                        </p>
                      )}
                    </div>
                    <div className="w-16">
                      {errors.serialAlpha && (
                        <p className="text-red-600 text-xs">
                          {" "}
                          {errors.serialAlpha}{" "}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-medium">شماره تماس:</label>
                  <div className="flex flex-row-reverse items-center border rounded-md overflow-hidden">
                    <span className="px-2 ml-2 bg-gray-100 text-gray-700 border-s border-gray-300">
                      {" "}
                      09{" "}
                    </span>
                    <input
                      type="text"
                      maxLength={9}
                      value={contactNumber.replace(/^09/, "")}
                      onChange={(e) =>
                        setContactNumber(
                          "09" +
                            e.target.value.replace(/[^0-9]/g, "").slice(0, 9)
                        )
                      }
                      className={`w-full px-3 py-2 text-left text-ltr focus:outline-none ${inputDisabledClass}`}
                      disabled={formDisabled}
                    />
                  </div>
                  {errors.contactNumber && (
                    <p className="text-red-600 text-sm mt-1">
                      {" "}
                      {errors.contactNumber}{" "}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 font-medium">شماره منزل:</label>
                  <div className="flex flex-row-reverse items-center border rounded-md overflow-hidden">
                    <span className="px-2 ml-2 bg-gray-100 text-gray-700 border-s border-gray-300">
                      {" "}
                      025{" "}
                    </span>
                    <input
                      type="text"
                      maxLength={8}
                      value={homeNumber.replace(/^025/, "")}
                      onChange={handleNumberInput(
                        (val) => setHomeNumber("025" + val),
                        8
                      )}
                      className={`w-full px-3 py-2 text-left text-ltr focus:outline-none ${inputDisabledClass}`}
                      disabled={formDisabled}
                    />
                  </div>
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
                <div className="col-span-full">
                  <label className="block mb-1 font-medium">آدرس:</label>
                  <input
                    type="text"
                    value={address}
                    onChange={handleAddressChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      addressError
                        ? "border-red-500 ring-red-400"
                        : "focus:ring-blue-400"
                    } ${inputDisabledClass}`}
                    disabled={formDisabled}
                  />
                  {addressError && (
                    <p className="text-red-600 text-sm mt-1">{addressError}</p>
                  )}
                </div>

                <div className="col-span-full mt-4">
                  <h3 className="text-lg font-semibold mb-2">عکس دانش آموز</h3>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                      className="hidden"
                      disabled={formDisabled}
                    />
                    <label
                      htmlFor="imageUpload"
                      className={`px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition ${inputDisabledClass}`}
                    >
                      انتخاب عکس
                    </label>
                    {croppedImage && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className={`px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition ${inputDisabledClass}`}
                        disabled={formDisabled}
                      >
                        حذف عکس
                      </button>
                    )}
                    <p>حجم عکس باید کمتر از ۱۵۰ کیلوبایت باشد.</p>
                  </div>
                  {imageError && (
                    <p className="text-red-600 text-sm mt-1">{imageError}</p>
                  )}
                  {croppedImage && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">عکس برش‌خورده:</h3>
                      <img
                        src={URL.createObjectURL(croppedImage)} // Display URL from Blob
                        alt="Cropped Preview"
                        className="w-full h-auto max-h-64 object-contain border border-gray-300 rounded"
                      />
                    </div>
                  )}
                </div>

                {/* Parent Information - Father */}
                <div className="col-span-full mt-6 bb2 py-4 px-2">
                  <h2 className="text-xl font-bold mb-4 border-b pb-2">
                    مشخصات پدر
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <label className="block mb-1 font-medium">نام:</label>
                      <input
                        type="text"
                        value={fatherName}
                        onChange={(e) => setFatherName(e.target.value)}
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
                      <div className="flex flex-row-reverse items-center border rounded-md overflow-hidden">
                        <span className="px-2 ml-2 bg-gray-100 text-gray-700 border-s border-gray-300">
                          {" "}
                          09{" "}
                        </span>
                        <input
                          type="text"
                          maxLength={9}
                          value={parentContact.replace(/^09/, "")}
                          onChange={(e) =>
                            setParentContact(
                              "09" +
                                e.target.value
                                  .replace(/[^0-9]/g, "")
                                  .slice(0, 9)
                            )
                          }
                          className={`w-full px-3 py-2 text-left text-ltr focus:outline-none ${inputDisabledClass}`}
                          disabled={formDisabled}
                        />
                      </div>
                      {parentErrors.parentContact && (
                        <p className="text-red-600 text-sm mt-1">
                          {parentErrors.parentContact}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">
                        کد ملی پدر:
                      </label>
                      <input
                        type="text"
                        maxLength={10}
                        value={parentNationalCode}
                        onChange={handleNumberInput(setParentNationalCode, 10)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                          parentErrors.parentNationalCode
                            ? "border-red-500 ring-red-400"
                            : "focus:ring-blue-400"
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                          parentErrors.parentEducation
                            ? "border-red-500 ring-red-400"
                            : "focus:ring-blue-400"
                        } ${inputDisabledClass}`}
                        disabled={formDisabled}
                      />
                      {parentErrors.parentEducation && (
                        <p className="text-red-600 text-sm mt-1">
                          {parentErrors.parentEducation}
                        </p>
                      )}
                    </div>
                    <div className="col-span-full">
                      <label className="block mb-1 font-medium">
                        آدرس محل کار:
                      </label>
                      <input
                        type="text"
                        value={parentWorkAddress}
                        onChange={handlePersianInput(setParentWorkAddress)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                          parentErrors.parentWorkAddress
                            ? "border-red-500 ring-red-400"
                            : "focus:ring-blue-400"
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
                </div>

                {/* Parent Information - Mother */}
                <div className="col-span-full mt-6 bb2 py-4 px-2">
                  <h2 className="text-xl font-bold mb-4 border-b pb-2">
                    مشخصات مادر
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <label className="block mb-1 font-medium">نام:</label>
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
                      <div className="flex flex-row-reverse items-center border rounded-md overflow-hidden">
                        <span className="px-2 ml-2 bg-gray-100 text-gray-700 border-s border-gray-300">
                          {" "}
                          09{" "}
                        </span>
                        <input
                          type="text"
                          maxLength={9}
                          value={motherContact.replace(/^09/, "")}
                          onChange={(e) =>
                            setMotherContact(
                              "09" +
                                e.target.value
                                  .replace(/[^0-9]/g, "")
                                  .slice(0, 9)
                            )
                          }
                          className={`w-full px-3 py-2 text-left text-ltr focus:outline-none ${inputDisabledClass}`}
                          disabled={formDisabled}
                        />
                      </div>
                      {motherErrors.motherContact && (
                        <p className="text-red-600 text-sm mt-1">
                          {motherErrors.motherContact}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">
                        کد ملی مادر:
                      </label>
                      <input
                        type="text"
                        maxLength={10}
                        value={motherNationalCode}
                        onChange={handleNumberInput(setMotherNationalCode, 10)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                          motherErrors.motherNationalCode
                            ? "border-red-500 ring-red-400"
                            : "focus:ring-blue-400"
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                          motherErrors.motherEducation
                            ? "border-red-500 ring-red-400"
                            : "focus:ring-blue-400"
                        } ${inputDisabledClass}`}
                        disabled={formDisabled}
                      />
                      {motherErrors.motherEducation && (
                        <p className="text-red-600 text-sm mt-1">
                          {motherErrors.motherEducation}
                        </p>
                      )}
                    </div>
                    <div className="col-span-full">
                      <label className="block mb-1 font-medium">
                        آدرس محل کار:
                      </label>
                      <input
                        type="text"
                        value={motherWorkAddress}
                        onChange={handlePersianInput(setMotherWorkAddress)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                          motherErrors.motherWorkAddress
                            ? "border-red-500 ring-red-400"
                            : "focus:ring-blue-400"
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

                {/* Educational Details */}
                <div className="col-span-full mt-6 bb2 py-4 px-2">
                  <h2 className="text-xl font-bold mb-4 border-b pb-2">
                    مشخصات تحصیلی
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block mb-1 font-medium">
                        مدرسه قبلی:
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
                    <div className="flex flex-col mb-4">
                      <label htmlFor="prevAvg" className="mb-2 text-gray-700">
                        معدل:
                      </label>
                      <input
                        id="prevAvg"
                        type="text" // تغییر به text
                        value={prevAvg}
                        onChange={handlePrevAvgChange} // استفاده از تابع جدید
                        className={`p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400 ${
                          prevAvgError ? "border-red-500" : ""
                        } ${inputDisabledClass}`}
                        disabled={formDisabled}
                      />
                      {prevAvgError && (
                        <p className="text-red-600 text-sm mt-1">
                          {prevAvgError}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col mb-4">
                      <label
                        htmlFor="prevDiscipline"
                        className="mb-2 text-gray-700"
                      >
                        نمره انضباط:
                      </label>
                      <input
                        id="prevDiscipline"
                        type="text" // تغییر به text
                        value={prevDiscipline}
                        onChange={handlePrevDisciplineChange} // استفاده از تابع جدید
                        className={`p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400 ${
                          prevDisciplineError ? "border-red-500" : ""
                        } ${inputDisabledClass}`}
                        disabled={formDisabled}
                      />
                      {prevDisciplineError && (
                        <p className="text-red-600 text-sm mt-1">
                          {prevDisciplineError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Report Card Upload */}
                <div className="col-span-full mt-4">
                  <h3 className="text-lg font-semibold mb-2">آپلود کارنامه</h3>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      id="reportCardUpload"
                      accept="image/*"
                      onChange={handleReportCardFileChange}
                      ref={reportCardInputRef}
                      className="hidden"
                      disabled={formDisabled}
                    />
                    <label
                      htmlFor="reportCardUpload"
                      className={`px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition ${inputDisabledClass}`}
                    >
                      انتخاب کارنامه
                    </label>
                    {reportCardImage && ( // Display reportCardImage
                      <button
                        type="button"
                        onClick={handleRemoveReportCard}
                        className={`px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition ${inputDisabledClass}`}
                        disabled={formDisabled}
                      >
                        حذف کارنامه
                      </button>
                    )}
                  </div>
                  {reportCardError && (
                    <p className="text-red-600 text-sm mt-1">
                      {reportCardError}
                    </p>
                  )}
                  {reportCardImage && ( // Display the final cropped image
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">کارنامه برش‌خورده:</h3>
                      <img
                        src={reportCardImage}
                        alt="Report Card Cropped Preview"
                        className="w-full h-auto max-h-64 object-contain border border-gray-300 rounded"
                      />
                    </div>
                  )}
                  <p>حجم عکس باید کمتر از ۱۵۰ کیلوبایت باشد.</p>
                </div>

                {/* Removed Vaccine Card Upload Section Completely */}

                {/* Form Submission Buttons */}
                <div className="col-span-full flex justify-end mt-8">
                  {!showContinueButton ? (
                    <>
                      <button
                        type="button"
                        onClick={fillDummyData}
                        className={`px-6 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition mr-4 ${inputDisabledClass}`}
                        disabled={formDisabled}
                      >
                        پر کردن با اطلاعات تستی
                      </button>
                      <button
                        type="submit"
                        className={`px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition ${inputDisabledClass}`}
                        disabled={formDisabled}
                      >
                        ثبت نام موقت
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      className="m-auto px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    >
                      ادامه ثبت نام موقت
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Personal Image Crop Modal */}
      {isCropModalOpen && currentImageForCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-lg">
            <h2 className="text-xl font-bold mb-4">برش تصویر</h2>
            <div className="relative w-full h-80">
              <Cropper
                image={currentImageForCrop}
                crop={crop}
                zoom={zoom}
                aspect={1 / 1}
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
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={closeCropModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  لغو
                </button>
                <button
                  type="button"
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

      {/* Removed Vaccine Image Crop Modal Completely */}

      {/* Report Card Crop Modal */}
      {isReportCardCropModalOpen && currentReportCardForCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-lg">
            <h2 className="text-xl font-bold mb-4">برش تصویر کارنامه</h2>
            <div className="relative w-full h-80">
              <Cropper
                image={currentReportCardForCrop} // Use the correct state
                crop={reportCardCrop}
                zoom={reportCardCropZoom}
                aspect={4 / 3} // نسبت ابعاد را اینجا تنظیم کنید
                onCropChange={setReportCardCrop}
                onZoomChange={setReportCardCropZoom}
                onCropComplete={onReportCardCropComplete}
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
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={closeReportCardCropModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  لغو
                </button>
                <button
                  type="button"
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

      {showConfirmationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">
              لطفا اطلاعات خود را بررسی کنید
            </h2>
            <div className="flex justify-center mt-6">
              <button
                onClick={handleFinalSubmitAfterConfirm}
                className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              >
                تایید
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full relative">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              قوانین پرداخت ثبت نام
            </h2>
            <div className="text-right text-[18px] leading-8 max-h-[60vh] overflow-y-auto px-2">
              <p>دانش آموز گرامی</p>
              <ol className="list-decimal pr-4">
                <li>
                  جهت ثبت نام و درج نام در لیست کلاسی، می بایست ابتدا{" "}
                  <span className="text-green-700 font-bold">
                    حداقل یک دوم مبلغ مصوب کلاس های تابستانی
                  </span>{" "}
                  را پرداخت نموده و مابقی را می توانید به صورت اقساط چک و یا
                  نقدی پرداخت نمایید.
                </li>
                <li>
                  شما می توانید مابقی هزینه کلاس ها را حداکثر دو قسط دیگر، با
                  مراجعه به ربات بله، به حساب دبیرستان واریز نمایید.
                </li>
                <li>
                  ثبت نام قطعی و درج نام شما در لیست کلاسی منوط به پرداخت هزینه
                  می باشد، لذا پس از ثبت نام در اولین فرصت اقدام به پرداخت هزینه
                  از طریق درگاه پرداخت اقدام نمایید.
                </li>
                <li className="text-red-600 font-bold">
                  درصورت تمایل به پرداخت یکباره کل مبلغ، مبلغ کل را در پرداخت
                  اولیه وارد نمایید
                </li>
              </ol>
              <p className="mt-4">
                خواهشمند است نهایت دقت لازم را جهت تکمیل موارد ذیل، مبذول
                فرمایید. اطلاعات وارد شده قابل تغییر نخواهد بود.
              </p>
              <p className="mt-2">
                پرداخت اولیه انجام شده است.{" "}
                <span className="text-red-600 font-bold">
                  در صورت عدم پرداخت مبلغ پیش ثبت نام، ثبت نام شما انجام نخواهد
                  شد
                </span>
              </p>
              <p className="mt-2">
                توجه: شایان ذکر است در صورتی ثبت نام نهایی می شود که پرداخت مبلغ
                پیش ثبت نام انجام شده باشد.
              </p>
              <p className="mt-2 text-blue-700">
                جهت پرداخت اقساط خود می بایست از طریق ربات پیام رسان بله نسبت به
                استعلام صورت وضعیت مالی و پرداخت آن اقدام نمایید -{" "}
                <span className="font-bold">mandegar_imamsadeq_bot@</span>
              </p>
            </div>
            <div className="flex flex-col items-center mt-8">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  disabled={!checkboxEnabled}
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                  className="w-5 h-5 accent-green-600"
                />
                <label
                  className={
                    checkboxEnabled
                      ? "text-green-700 font-bold"
                      : "text-gray-400"
                  }
                >
                  قوانین پرداخت را مطالعه کردم و می‌پذیرم
                </label>
              </div>
              <div className="mt-4 text-center text-lg">
                <span className="font-bold">{countdown}</span> ثانیه تا فعال شدن
                تیک
              </div>
              <div className="mt-2 text-sm text-gray-500">
                بعد از گذشت 30 ثانیه می‌توانید تیک را بزنید
              </div>
            </div>
          </div>
        </div>
      )}
      {showPaymentForm && (
        <div className="w-full">
          <div className="w-full flex flex-col items-center mt-12">
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 w-full max-w-4xl shadow border">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <span className="text-base sm:text-lg font-bold mb-2 sm:mb-0">
                  جمع کل : ۱۰۰٬۰۰۰٬۰۰۰ ریال
                </span>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <label className="font-bold">پرداخت اولیه :</label>
                  <div className="flex flex-col">
                    <input
                      className={`border rounded px-3 py-1 w-32 sm:w-40 text-center ${
                        paymentErrors.initial ? "border-red-500" : ""
                      }`}
                      value={formatNumberWithSlash(paymentFields.initial)}
                      onChange={handleInitialPaymentChange}
                      placeholder="۵۰۰۰۰۰۰۰"
                    />
                    {paymentErrors.initial && (
                      <span className="text-red-500 text-sm mt-1">
                        {paymentErrors.initial}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* قسط اول */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="col-span-1">
                  <label>مبلغ قسط اول :</label>
                  <input
                    className="border rounded px-3 py-1 w-full text-center"
                    value={formatNumberWithSlash(paymentFields.installment1)}
                    onChange={(e) => handleInstallmentChange(e, "installment1")}
                    placeholder=""
                  />
                </div>
                <div className="col-span-1">
                  <label>تاریخ قسط اول :</label>
                  <DatePicker
                    value={paymentFields.date1Obj}
                    onChange={(date) =>
                      setPaymentFields((f) => ({
                        ...f,
                        date1Obj: date,
                        date1: date
                          ? `${date.year}/${date.month
                              .toString()
                              .padStart(2, "0")}/${date.day
                              .toString()
                              .padStart(2, "0")}`
                          : "",
                      }))
                    }
                    calendar={persian}
                    locale={persian_fa}
                    shouldHighlightWeekends
                    inputPlaceholder="انتخاب تاریخ"
                    colorPrimary="#198754"
                    minDate={minDate}
                    maxDate={maxDate}
                    inputClassName={`w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 ${
                      paymentErrors.date1 ? "border-red-500" : ""
                    }`}
                    renderInput={(props) => (
                      <div className="flex flex-col">
                        <input
                          {...props}
                          readOnly
                          className="w-full px-3 py-1 border rounded-md bg-gray-50 cursor-pointer text-center"
                          onKeyDown={(e) => e.preventDefault()}
                          onPaste={(e) => e.preventDefault()}
                          onInput={(e) => e.preventDefault()}
                          onKeyPress={(e) => e.preventDefault()}
                          onKeyUp={(e) => e.preventDefault()}
                          onCompositionStart={(e) => e.preventDefault()}
                          onCompositionEnd={(e) => e.preventDefault()}
                          onCompositionUpdate={(e) => e.preventDefault()}
                          onBeforeInput={(e) => e.preventDefault()}
                          onSelect={(e) => e.preventDefault()}
                          onCut={(e) => e.preventDefault()}
                          onCopy={(e) => e.preventDefault()}
                          onDrag={(e) => e.preventDefault()}
                          onDragStart={(e) => e.preventDefault()}
                          onDrop={(e) => e.preventDefault()}
                        />
                        {paymentErrors.date1 && (
                          <span className="text-red-500 text-sm mt-1">
                            {paymentErrors.date1}
                          </span>
                        )}
                      </div>
                    )}
                  />
                </div>
                <div className="col-span-1">
                  <label>شماره چک :</label>
                  <input
                    className="border rounded px-3 py-1 w-full text-center"
                    value={paymentFields.check1}
                    onChange={(e) => handleInstallmentChange(e, "check1")}
                    placeholder=""
                  />
                </div>
                <div className="col-span-1">
                  <label>نام بانک :</label>
                  <input
                    className="border rounded px-3 py-1 w-full text-center"
                    value={paymentFields.bank1}
                    onChange={(e) => handleInstallmentChange(e, "bank1")}
                    placeholder=""
                  />
                </div>
              </div>
              {/* قسط دوم */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="col-span-1">
                  <label>مبلغ قسط دوم :</label>
                  <input
                    className="border rounded px-3 py-1 w-full text-center"
                    value={formatNumberWithSlash(paymentFields.installment2)}
                    onChange={(e) => handleInstallmentChange(e, "installment2")}
                    placeholder=""
                  />
                </div>
                <div className="col-span-1">
                  <label>تاریخ قسط دوم :</label>
                  <DatePicker
                    value={paymentFields.date2Obj}
                    onChange={(date) =>
                      setPaymentFields((f) => ({
                        ...f,
                        date2Obj: date,
                        date2: date
                          ? `${date.year}/${date.month
                              .toString()
                              .padStart(2, "0")}/${date.day
                              .toString()
                              .padStart(2, "0")}`
                          : "",
                      }))
                    }
                    calendar={persian}
                    locale={persian_fa}
                    shouldHighlightWeekends
                    inputPlaceholder="انتخاب تاریخ"
                    colorPrimary="#198754"
                    minDate={minDate}
                    maxDate={maxDate}
                    inputClassName={`w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 ${
                      paymentErrors.date2 ? "border-red-500" : ""
                    }`}
                    renderInput={(props) => (
                      <div className="flex flex-col">
                        <input
                          {...props}
                          readOnly
                          className="w-full px-3 py-1 border rounded-md bg-gray-50 cursor-pointer text-center"
                          onKeyDown={(e) => e.preventDefault()}
                          onPaste={(e) => e.preventDefault()}
                          onInput={(e) => e.preventDefault()}
                          onKeyPress={(e) => e.preventDefault()}
                          onKeyUp={(e) => e.preventDefault()}
                          onCompositionStart={(e) => e.preventDefault()}
                          onCompositionEnd={(e) => e.preventDefault()}
                          onCompositionUpdate={(e) => e.preventDefault()}
                          onBeforeInput={(e) => e.preventDefault()}
                          onSelect={(e) => e.preventDefault()}
                          onCut={(e) => e.preventDefault()}
                          onCopy={(e) => e.preventDefault()}
                          onDrag={(e) => e.preventDefault()}
                          onDragStart={(e) => e.preventDefault()}
                          onDrop={(e) => e.preventDefault()}
                        />
                        {paymentErrors.date2 && (
                          <span className="text-red-500 text-sm mt-1">
                            {paymentErrors.date2}
                          </span>
                        )}
                      </div>
                    )}
                  />
                </div>
                <div className="col-span-1">
                  <label>شماره چک :</label>
                  <input
                    className="border rounded px-3 py-1 w-full text-center"
                    value={paymentFields.check2}
                    onChange={(e) => handleInstallmentChange(e, "check2")}
                    placeholder=""
                  />
                </div>
                <div className="col-span-1">
                  <label>نام بانک :</label>
                  <input
                    className="border rounded px-3 py-1 w-full text-center"
                    value={paymentFields.bank2}
                    onChange={(e) => handleInstallmentChange(e, "bank2")}
                    placeholder=""
                  />
                </div>
              </div>
              {/* قسط سوم */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="col-span-1">
                  <label>مبلغ قسط سوم :</label>
                  <input
                    className="border rounded px-3 py-1 w-full text-center"
                    value={formatNumberWithSlash(paymentFields.installment3)}
                    onChange={(e) => handleInstallmentChange(e, "installment3")}
                    placeholder=""
                  />
                </div>
                <div className="col-span-1">
                  <label>تاریخ قسط سوم :</label>
                  <DatePicker
                    value={paymentFields.date3Obj}
                    onChange={(date) =>
                      setPaymentFields((f) => ({
                        ...f,
                        date3Obj: date,
                        date3: date
                          ? `${date.year}/${date.month
                              .toString()
                              .padStart(2, "0")}/${date.day
                              .toString()
                              .padStart(2, "0")}`
                          : "",
                      }))
                    }
                    calendar={persian}
                    locale={persian_fa}
                    shouldHighlightWeekends
                    inputPlaceholder="انتخاب تاریخ"
                    colorPrimary="#198754"
                    minDate={minDate}
                    maxDate={maxDate}
                    inputClassName={`w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 ${
                      paymentErrors.date3 ? "border-red-500" : ""
                    }`}
                    renderInput={(props) => (
                      <div className="flex flex-col">
                        <input
                          {...props}
                          readOnly
                          className="w-full px-3 py-1 border rounded-md bg-gray-50 cursor-pointer text-center"
                          onKeyDown={(e) => e.preventDefault()}
                          onPaste={(e) => e.preventDefault()}
                          onInput={(e) => e.preventDefault()}
                          onKeyPress={(e) => e.preventDefault()}
                          onKeyUp={(e) => e.preventDefault()}
                          onCompositionStart={(e) => e.preventDefault()}
                          onCompositionEnd={(e) => e.preventDefault()}
                          onCompositionUpdate={(e) => e.preventDefault()}
                          onBeforeInput={(e) => e.preventDefault()}
                          onSelect={(e) => e.preventDefault()}
                          onCut={(e) => e.preventDefault()}
                          onCopy={(e) => e.preventDefault()}
                          onDrag={(e) => e.preventDefault()}
                          onDragStart={(e) => e.preventDefault()}
                          onDrop={(e) => e.preventDefault()}
                        />
                        {paymentErrors.date3 && (
                          <span className="text-red-500 text-sm mt-1">
                            {paymentErrors.date3}
                          </span>
                        )}
                      </div>
                    )}
                  />
                </div>
                <div className="col-span-1">
                  <label>شماره چک :</label>
                  <input
                    className="border rounded px-3 py-1 w-full text-center"
                    value={paymentFields.check3}
                    onChange={(e) => handleInstallmentChange(e, "check3")}
                    placeholder=""
                  />
                </div>
                <div className="col-span-1">
                  <label>نام بانک :</label>
                  <input
                    className="border rounded px-3 py-1 w-full text-center"
                    value={paymentFields.bank3}
                    onChange={(e) => handleInstallmentChange(e, "bank3")}
                    placeholder=""
                  />
                </div>
              </div>
              {paymentErrors.installments && (
                <div className="text-red-500 text-sm mt-2 text-center">
                  {paymentErrors.installments}
                </div>
              )}
            </div>
            <div className="flex justify-center mt-6">
              <button
                className="px-8 py-2 bg-green-700 text-white rounded hover:bg-green-800 font-bold"
                onClick={handlePaymentSubmit}
              >
                ثبت نام و پرداخت
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
            <h2 className="text-xl font-bold mb-6 text-green-700">
              اطلاعات با موفقیت ثبت شد لطفا منتظر پیامک باشید.
            </h2>
            <button
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={() => setShowSuccessModal(false)}
            >
              بستن
            </button>
          </div>
        </div>
      )}
      {showPaymentErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
            <h2 className="text-xl font-bold mb-6 text-red-700">
              {paymentErrorModalMessage}
            </h2>
            <button
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={() => setShowPaymentErrorModal(false)}
            >
              باشه
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default MainOfMyPage;
