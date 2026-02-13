import Megoldás from "@/app/Megoldás";

export default function MainPage() {
  const m: Megoldás = new Megoldás("dakar.txt");

  // 7. feladat:
  m.kamiontípusokÍrása("kamiontipusok.txt");

  return (
    <>
      <p>2. feladat: Bajnokok száma: {m.bajnokokSzáma} </p>
      <p>3. feladat: Francia bajnokok aránya: {m.FranciaVersenyzőkSzázalék.toFixed(2)}%</p>
      <p>4. feladat: {m.voltAzonosOrszágbólBajnokTrió ? "Volt" : "Nem volt"} ilyen év</p>
      <p>5. feladat: A követkető évben/években nem rendezték meg a versenyt: {m.nemVoltVerseny}</p>
      <p>
        6. feladat: Mr. Dakar címet a {m.bajnokMrGyőzelmekSzáma}-szoros győztes {m.banokMrNeve}{" "}
        kapta.
      </p>
    </>
  );
}
