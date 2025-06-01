// import "./App.css";
// import { useState } from "react";
// import Select from "react-select";
// import "react-modern-calendar-datepicker/lib/DatePicker.css";

// // لیست ساده از شهرهای ایران
// const iranCities = [
//   { value: "آذربایجان شرقی", label: "آذربایجان شرقی" },
//   { value: "آذربایجان غربی", label: "آذربایجان غربی" },
//   { value: "اردبیل", label: "اردبیل" },
//   { value: "اصفهان", label: "اصفهان" },
//   { value: "البرز", label: "البرز" },
//   { value: "ایلام", label: "ایلام" },
//   { value: "بوشهر", label: "بوشهر" },
//   { value: "تهران", label: "تهران" },
//   { value: "چهارمحال و بختیاری", label: "چهارمحال و بختیاری" },
//   { value: "خراسان جنوبی", label: "خراسان جنوبی" },
//   { value: "خراسان رضوی", label: "خراسان رضوی" },
//   { value: "خراسان شمالی", label: "خراسان شمالی" },
//   { value: "خوزستان", label: "خوزستان" },
//   { value: "زنجان", label: "زنجان" },
//   { value: "سمنان", label: "سمنان" },
//   { value: "سیستان و بلوچستان", label: "سیستان و بلوچستان" },
//   { value: "فارس", label: "فارس" },
//   { value: "قزوین", label: "قزوین" },
//   { value: "قم", label: "قم" },
//   { value: "کردستان", label: "کردستان" },
//   { value: "کرمان", label: "کرمان" },
//   { value: "کرمانشاه", label: "کرمانشاه" },
//   { value: "کهگیلویه و بویراحمد", label: "کهگیلویه و بویراحمد" },
//   { value: "گلستان", label: "گلستان" },
//   { value: "گیلان", label: "گیلان" },
//   { value: "لرستان", label: "لرستان" },
//   { value: "مازندران", label: "مازندران" },
//   { value: "مرکزی", label: "مرکزی" },
//   { value: "هرمزگان", label: "هرمزگان" },
//   { value: "همدان", label: "همدان" },
//   { value: "یزد", label: "یزد" },
// ];

// const reshte = [{ value: "دهم", label: "دهم" }];

// // لیست رشته‌ها
// const majors = [
//   { value: "ریاضی", label: "ریاضی" },
//   { value: "تجربی", label: "تجربی" },
//   { value: "انسانی", label: "انسانی" },
//   { value: "معارف", label: "معارف" },
// ];

// function App() {
//   return (
//     <>
//       {/* start header of page */}
//       <Header />
//       {/* end header of page */}

//       {/* start main of page */}
//       <Main />
//       {/* end main of page */}

//       {/* start footer of page */}
//       <Footer />
//       {/* end footer of page */}
//     </>
//   );
// }

// function Header() {
//   return (
//     <>
//       <header>
//         <p> </p>
//       </header>
//     </>
//   );
// }

// function Main() {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [fatherName, setFatherName] = useState("");
//   const [nationalCode, setNationalCode] = useState("");
//   const [birthDate, setBirthDate] = useState("");
//   const [birthPlace, setBirthPlace] = useState(null);
//   const [entekhanReshte, setEntekhanReshte] = useState(null);
//   const [grade, setGrade] = useState("دهم");
//   const [major, setMajor] = useState(null);

//   const handlePersianInput = (setter) => (e) => {
//     const value = e.target.value;
//     const regex = /^[\u0600-\u06FF\s]*$/;
//     if (regex.test(value)) setter(value);
//   };

//   const handleNumberInput = (e) => {
//     const value = e.target.value;
//     const regex = /^[0-9]*$/;
//     if (regex.test(value)) setNationalCode(value);
//   };

//   return (
//     <main>
//       <div className="flex flex-col items-center">
//         <div>
//           <p className="text-green-600 font-bold underline text-lg mb-4">
//             فرم ثبت نام
//           </p>
//         </div>

//         <div className="w-full max-w-screen-xl mx-auto p-6 bg-white shadow-md rounded-lg">
//           <h2 className="text-xl font-bold mb-4">فرم اطلاعات</h2>

//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             {/* نام */}
//             <div>
//               <label className="block text-sm font-medium">نام:</label>
//               <input
//                 type="text"
//                 value={firstName}
//                 onChange={handlePersianInput(setFirstName)}
//                 className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             {/* نام خانوادگی */}
//             <div>
//               <label className="block text-sm font-medium">نام خانوادگی:</label>
//               <input
//                 type="text"
//                 value={lastName}
//                 onChange={handlePersianInput(setLastName)}
//                 className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             {/* نام پدر */}
//             <div>
//               <label className="block text-sm font-medium">نام پدر:</label>
//               <input
//                 type="text"
//                 value={fatherName}
//                 onChange={handlePersianInput(setFatherName)}
//                 className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             {/* شماره ملی */}
//             <div>
//               <label className="block text-sm font-medium">شماره ملی:</label>
//               <input
//                 type="text"
//                 maxLength={10}
//                 value={nationalCode}
//                 onChange={handleNumberInput}
//                 className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             {/* تاریخ تولد */}
//             <div>
//               <label className="block text-sm font-medium">تاریخ تولد:</label>
//               <input
//                 type="text"
//                 placeholder="مثال: 1402/01/01"
//                 value={birthDate}
//                 onChange={(e) => setBirthDate(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             {/* محل تولد */}
//             <div>
//               <label className="block text-sm font-medium">محل تولد:</label>
//               <Select
//                 options={iranCities}
//                 value={birthPlace}
//                 onChange={setBirthPlace}
//                 placeholder="انتخاب شهر"
//               />
//             </div>

//             {/* پایه تحصیلی */}
//             <div>
//               <label className="block text-sm font-medium">پایه تحصیلی:</label>
//               {/* <input
//                 type="text"
//                 value={grade}
//                 readOnly
//                 className="w-full px-3 py-2 border bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               /> */}
//               <Select
//                 options={reshte}
//                 value={reshte}
//                 onChange={setEntekhanReshte}
//                 placeholder="انتخاب رشته"
//               />
//             </div>

//             {/* رشته */}
//             <div>
//               <label className="block text-sm font-medium">رشته:</label>
//               <Select
//                 options={majors}
//                 value={major}
//                 onChange={setMajor}
//                 placeholder="انتخاب رشته"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

// function Footer() {
//   return (
//     <>
//       <footer>
//         <p> </p>
//       </footer>
//     </>
//   );
// }

// export default App;
import "./App.css";
import { useState, useRef } from "react";
import Select from "react-select";
import "react-modern-calendar-datepicker/lib/DatePicker.css";

// لیست کامل شهرهای ایران
const iranCities = [
  { value: "آذربایجان شرقی", label: "آذربایجان شرقی" },
  { value: "آذربایجان غربی", label: "آذربایجان غربی" },
  { value: "اردبیل", label: "اردبیل" },
  { value: "اصفهان", label: "اصفهان" },
  { value: "البرز", label: "البرز" },
  { value: "ایلام", label: "ایلام" },
  { value: "بوشهر", label: "بوشهر" },
  { value: "تهران", label: "تهران" },
  { value: "چهارمحال و بختیاری", label: "چهارمحال و بختیاری" },
  { value: "خراسان جنوبی", label: "خراسان جنوبی" },
  { value: "خراسان رضوی", label: "خراسان رضوی" },
  { value: "خراسان شمالی", label: "خراسان شمالی" },
  { value: "خوزستان", label: "خوزستان" },
  { value: "زنجان", label: "زنجان" },
  { value: "سمنان", label: "سمنان" },
  { value: "سیستان و بلوچستان", label: "سیستان و بلوچستان" },
  { value: "فارس", label: "فارس" },
  { value: "قزوین", label: "قزوین" },
  { value: "قم", label: "قم" },
  { value: "کردستان", label: "کردستان" },
  { value: "کرمان", label: "کرمان" },
  { value: "کرمانشاه", label: "کرمانشاه" },
  { value: "کهگیلویه و بویراحمد", label: "کهگیلویه و بویراحمد" },
  { value: "گلستان", label: "گلستان" },
  { value: "گیلان", label: "گیلان" },
  { value: "لرستان", label: "لرستان" },
  { value: "مازندران", label: "مازندران" },
  { value: "مرکزی", label: "مرکزی" },
  { value: "هرمزگان", label: "هرمزگان" },
  { value: "همدان", label: "همدان" },
  { value: "یزد", label: "یزد" },
];

const iransodoor = [
  { value: "آذربایجان شرقی", label: "آذربایجان شرقی" },
  { value: "آذربایجان غربی", label: "آذربایجان غربی" },
  { value: "اردبیل", label: "اردبیل" },
  { value: "اصفهان", label: "اصفهان" },
  { value: "البرز", label: "البرز" },
  { value: "ایلام", label: "ایلام" },
  { value: "بوشهر", label: "بوشهر" },
  { value: "تهران", label: "تهران" },
  { value: "چهارمحال و بختیاری", label: "چهارمحال و بختیاری" },
  { value: "خراسان جنوبی", label: "خراسان جنوبی" },
  { value: "خراسان رضوی", label: "خراسان رضوی" },
  { value: "خراسان شمالی", label: "خراسان شمالی" },
  { value: "خوزستان", label: "خوزستان" },
  { value: "زنجان", label: "زنجان" },
  { value: "سمنان", label: "سمنان" },
  { value: "سیستان و بلوچستان", label: "سیستان و بلوچستان" },
  { value: "فارس", label: "فارس" },
  { value: "قزوین", label: "قزوین" },
  { value: "قم", label: "قم" },
  { value: "کردستان", label: "کردستان" },
  { value: "کرمان", label: "کرمان" },
  { value: "کرمانشاه", label: "کرمانشاه" },
  { value: "کهگیلویه و بویراحمد", label: "کهگیلویه و بویراحمد" },
  { value: "گلستان", label: "گلستان" },
  { value: "گیلان", label: "گیلان" },
  { value: "لرستان", label: "لرستان" },
  { value: "مازندران", label: "مازندران" },
  { value: "مرکزی", label: "مرکزی" },
  { value: "هرمزگان", label: "هرمزگان" },
  { value: "همدان", label: "همدان" },
  { value: "یزد", label: "یزد" },
];

// پایه تحصیلی
const grades = [{ value: "دهم", label: "دهم" }];

// رشته‌ها
const majors = [
  { value: "ریاضی", label: "ریاضی" },
  { value: "تجربی", label: "تجربی" },
  { value: "انسانی", label: "انسانی" },
  { value: "معارف", label: "معارف" },
];

// حروف الف برای سریال شناسنامه
const alefOptions = [
  { value: "ا", label: "ا" },
  { value: "ب", label: "ب" },
  { value: "پ", label: "پ" },
  { value: "ت", label: "ت" },
  { value: "ث", label: "ث" },
  { value: "ج", label: "ج" },
  { value: "چ", label: "چ" },
  { value: "ح", label: "ح" },
  { value: "خ", label: "خ" },
  { value: "د", label: "د" },
  { value: "ذ", label: "ذ" },
  { value: "ر", label: "ر" },
  { value: "ز", label: "ز" },
  { value: "ژ", label: "ژ" },
  { value: "س", label: "س" },
  { value: "ش", label: "ش" },
  { value: "ص", label: "ص" },
  { value: "ض", label: "ض" },
  { value: "ط", label: "ط" },
  { value: "ظ", label: "ظ" },
  { value: "ع", label: "ع" },
  { value: "غ", label: "غ" },
  { value: "ف", label: "ف" },
  { value: "ق", label: "ق" },
  { value: "ک", label: "ک" },
  { value: "گ", label: "گ" },
  { value: "ل", label: "ل" },
  { value: "م", label: "م" },
  { value: "ن", label: "ن" },
  { value: "و", label: "و" },
  { value: "ه", label: "ه" },
  { value: "ی", label: "ی" },
];

function App() {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
}

function Header() {
  return (
    <header className="p-4 text-center bg-green-100">
      <h1 className="text-2xl font-bold">فرم ثبت نام</h1>
    </header>
  );
}

function Main() {
  // مقداردهی اولیه state ها
  // استیت آدرس (input بزرگتر)
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");

  const [xOffset, setXOffset] = useState(0);

  // استیت آپلود عکس
  const [imageFile, setImageFile] = useState(null); // فایل عکس
  const [imageUrl, setImageUrl] = useState(null); // URL برای نمایش عکس
  const [zoom, setZoom] = useState(1); // میزان بزرگنمایی عکس
  const [imageError, setImageError] = useState("");

  const fileInputRef = useRef();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthPlace, setBirthPlace] = useState(null);
  const [iranSodoor, setIranSodoor] = useState(null);
  const [grade, setGrade] = useState(null);
  const [major, setMajor] = useState(null);
  const [serialAlpha, setSerialAlpha] = useState(null); // حروف سریال شناسنامه
  const [serialNumber, setSerialNumber] = useState(""); // اعداد سریال شناسنامه
  const [serialNumber2, setSerialNumber2] = useState(""); // بخش دوم سریال شناسنامه
  const [contactNumber, setContactNumber] = useState(""); // شماره تماس
  const [homeNumber, setHomeNumber] = useState(""); // شماره منزل

  // خطاها
  const [errors, setErrors] = useState({});

  // رفرنس ها برای اسکرول به خطا
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

  // هندل تغییر فایل عکس
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // اعتبارسنجی فرمت عکس (مثلاً فقط jpg/png)
    if (!file.type.startsWith("image/")) {
      setImageError("لطفا فقط فایل عکس انتخاب کنید.");
      setImageFile(null);
      setImageUrl(null);
      return;
    }

    setImageError("");
    setImageFile(file);

    // ساخت URL برای نمایش عکس
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  // حذف عکس انتخاب شده
  const handleRemoveImage = () => {
    setImageFile(null);
    setImageUrl(null);
    setZoom(1);
    fileInputRef.current.value = null;
  };

  // زوم کردن عکس
  const zoomIn = () => setZoom((z) => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));

  // چک کردن ورودی‌های فارسی
  const handlePersianInput = (setter) => (e) => {
    const value = e.target.value;
    const regex = /^[\u0600-\u06FF\s]*$/;
    if (regex.test(value) || value === "") setter(value);
  };

  // فقط عدد بگیر
  const handleNumberInput =
    (setter, maxLength = null) =>
    (e) => {
      let value = e.target.value;
      value = value.replace(/[^0-9]/g, ""); // فقط عدد باشه
      if (maxLength) value = value.slice(0, maxLength);
      setter(value);
    };

  // اعتبارسنجی فرم
  const validate = () => {
    let newErrors = {};
    let valid = true;
    if (address.trim() === "") {
      setAddressError("وارد کردن آدرس الزامی است.");
      valid = false;
    }
    if (!imageFile) {
      setImageError("آپلود عکس الزامی است.");
      valid = false;
    }
    if (!firstName) newErrors.firstName = "نام را وارد کنید";
    if (!lastName) newErrors.lastName = "نام خانوادگی را وارد کنید";
    if (!fatherName) newErrors.fatherName = "نام پدر را وارد کنید";

    if (!nationalCode) newErrors.nationalCode = "شماره ملی را وارد کنید";
    else if (nationalCode.length !== 10)
      newErrors.nationalCode = "شماره ملی باید ۱۰ رقم باشد";

    if (!birthDate) newErrors.birthDate = "تاریخ تولد را وارد کنید";

    if (!birthPlace) newErrors.birthPlace = "محل تولد را انتخاب کنید";

    if (!grade) newErrors.grade = "پایه تحصیلی را انتخاب کنید";

    if (!major) newErrors.major = "رشته تحصیلی را انتخاب کنید";

    if (!serialAlpha) newErrors.serialAlpha = "حرف الف سریال را انتخاب کنید";
    if (!serialNumber)
      newErrors.serialNumber = "بخش اول سریال شناسنامه را وارد کنید";
    else if (serialNumber.length !== 2)
      newErrors.serialNumber = "بخش اول سریال باید ۲ رقم باشد";

    if (!serialNumber2)
      newErrors.serialNumber2 = "بخش دوم سریال شناسنامه را وارد کنید";
    else if (serialNumber2.length !== 3)
      newErrors.serialNumber2 = "بخش دوم سریال باید ۳ رقم باشد";

    if (!contactNumber) newErrors.contactNumber = "شماره تماس را وارد کنید";
    else if (contactNumber.length !== 11)
      newErrors.contactNumber = "شماره تماس باید ۱۱ رقم باشد";

    if (!homeNumber) newErrors.homeNumber = "شماره منزل را وارد کنید";
    else if (homeNumber.length !== 11)
      newErrors.homeNumber = "شماره منزل باید ۱۱ رقم باشد";

    setErrors(newErrors);

    // اسکرول به اولین فیلد خطا
    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      if (refs[firstErrorKey]?.current) {
        refs[firstErrorKey].current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        refs[firstErrorKey].current.focus();
      }
      return false;
    }
    return true;
  };

  // ارسال فرم
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // داده‌ها را می‌توانید اینجا بفرستید یا کارهای بعدی را انجام دهید
    alert("فرم با موفقیت ثبت شد!");
  };

  return (
    <main className="max-w-screen-lg mx-auto p-6">
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* نام */}
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
              }`}
            />
            {errors.firstName && (
              <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* نام خانوادگی */}
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
              }`}
            />
            {errors.lastName && (
              <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* نام پدر */}
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
              }`}
            />
            {errors.fatherName && (
              <p className="text-red-600 text-sm mt-1">{errors.fatherName}</p>
            )}
          </div>

          {/* شماره ملی */}
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
              }`}
            />
            {errors.nationalCode && (
              <p className="text-red-600 text-sm mt-1">{errors.nationalCode}</p>
            )}
          </div>

          {/* تاریخ تولد */}
          <div>
            <label className="block mb-1 font-medium">تاریخ تولد:</label>
            <input
              ref={refs.birthDate}
              type="text"
              placeholder="مثال: 1402/01/01"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.birthDate
                  ? "border-red-500 ring-red-400"
                  : "focus:ring-blue-400"
              }`}
            />
            {errors.birthDate && (
              <p className="text-red-600 text-sm mt-1">{errors.birthDate}</p>
            )}
          </div>

          {/* محل تولد */}
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

          {/* پایه تحصیلی */}
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
                      borderColor: errors.grade ? "#f87171" : base.borderColor,
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

          {/* رشته */}
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
                      borderColor: errors.major ? "#f87171" : base.borderColor,
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

          {/* سریال شناسنامه - حرف الف */}
          <div className="flex flex-col w-full">
            <label className="block mb-1 font-medium">شماره شناسنامه:</label>
            <div className="flex justify-center items-center">
              <div className="w-[25%]">
                <input
                  ref={refs.serialNumber}
                  type="text"
                  maxLength={2}
                  value={serialNumber}
                  onChange={handleNumberInput(setSerialNumber, 2)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.serialNumber
                      ? "border-red-500 ring-red-400"
                      : "focus:ring-blue-400"
                  }`}
                />
                {errors.serialNumber && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.serialNumber}
                  </p>
                )}
              </div>
              {/* سریال شناسنامه - بخش اول عددی (۲ رقم) */}

              <div className="w-[25%]">
                <input
                  ref={refs.serialNumber2}
                  type="text"
                  maxLength={3}
                  value={serialNumber2}
                  onChange={handleNumberInput(setSerialNumber2, 3)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.serialNumber2
                      ? "border-red-500 ring-red-400"
                      : "focus:ring-blue-400"
                  }`}
                />
                {errors.serialNumber2 && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.serialNumber2}
                  </p>
                )}
              </div>

              {/* سریال شناسنامه - بخش دوم عددی (۳ رقم) */}
              <div className="w-[50%]">
                <div ref={refs.serialAlpha}>
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
                        borderColor: errors.serialAlpha
                          ? "#f87171"
                          : base.borderColor,
                        "&:hover": {
                          borderColor: errors.serialAlpha
                            ? "#f87171"
                            : base.borderColor,
                        },
                        boxShadow: errors.serialAlpha
                          ? "0 0 0 1px #f87171"
                          : base.boxShadow,
                      }),
                    }}
                  />
                </div>
                {errors.serialAlpha && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.serialAlpha}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* شماره تماس (موبایل) */}
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
              }`}
            />
            {errors.contactNumber && (
              <p className="text-red-600 text-sm mt-1">
                {errors.contactNumber}
              </p>
            )}
          </div>

          {/* شماره منزل */}
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
              }`}
            />
            {errors.homeNumber && (
              <p className="text-red-600 text-sm mt-1">{errors.homeNumber}</p>
            )}
          </div>

          {/* محل صدور */}
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
          {/* آدرس خانه - عرض 50% یعنی دو ستون */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">آدرس خانه:</label>
            <textarea
              value={address}
              onChange={handleAddressChange}
              rows={4}
              placeholder="آدرس کامل خود را وارد کنید"
              className={`w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 ${
                addressError
                  ? "border-red-500 ring-red-400"
                  : "focus:ring-blue-400"
              }`}
            />
            {addressError && (
              <p className="text-red-600 text-sm mt-1">{addressError}</p>
            )}
          </div>

          {/* آپلود عکس */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">عکس:</label>
            <div className="flex flex-col items-center">
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
                      transform: `scale(${zoom}) translateX(${xOffset}px)`,
                      transition: "transform 0.2s",
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none", // تا کلیک فقط روی کادر باشد
                      userSelect: "none",
                    }}
                  />
                ) : (
                  <span className="text-gray-400">برای آپلود کلیک کنید</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="hidden"
                />
              </div>
              {/* اسلایدر زوم و جابجایی فقط وقتی عکس هست */}
              {imageUrl && (
                <>
                  <div
                    className="flex items-center gap-2 mt-2 w-48"
                    style={{ direction: "rtl" }}
                  >
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
                  <div
                    className="flex items-center gap-2 mt-2 w-48"
                    style={{ direction: "rtl" }}
                  >
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
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      حذف
                    </button>
                  </div>
                </>
              )}
              {imageError && (
                <p className="text-red-600 text-sm mt-1">{imageError}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            ثبت
          </button>
        </div>
      </form>
    </main>
  );
}

function Footer() {
  return (
    <footer className="p-4 mt-12 text-center bg-green-100 text-green-700">
      © ۱۴۰۲ - فرم ثبت نام نمونه
    </footer>
  );
}

export default App;
