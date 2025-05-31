import "./App.css";

function App() {
  return (
    <>
      {/* start header of page */}
      <Header />
      {/* end header of page */}

      {/* start main of page */}
      <Main />
      {/* end main of page */}

      {/* start footer of page */}
      <Footer />
      {/* end footer of page */}
    </>
  );
}

function Header() {
  return (
    <>
      <header>
        <p> </p>
      </header>
    </>
  );
}

function Main() {
  return (
    <>
      <main>
        <div>
          <div>
            <p>فرم ثبت نام</p>
          </div>
          <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">فرم اطلاعات</h2>

            <div className="grid grid-cols-4 gap-4">
              {/* نام */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">نام:</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* نام خانوادگی */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  نام خانوادگی:
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* نام پدر */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">نام پدر:</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* یک input اضافی، مثلا شماره ملی */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">شماره ملی:</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function Footer() {
  return (
    <>
      <footer>
        <p> </p>
      </footer>
    </>
  );
}

export default App;
