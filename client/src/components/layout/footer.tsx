export function Footer() {
  return (
    <footer className={"bg-white px-4 pt-14 pb-26"}>
      <div className={"flex flex-col gap-16 pb-12"}>
        <div className={"flex flex-col gap-2"}>
          <p
            className={
              "font-display text-center text-2xl leading-10 font-bold text-stone-700 not-italic"
            }
          >
            Scenario Compass Platform
          </p>
          <p className={"text-center font-sans text-xl leading-6 font-normal text-stone-700"}>
            by IIASA
          </p>
        </div>
      </div>
      <div className={"border-t border-stone-200 py-14"}></div>
    </footer>
  );
}
