import fs from "fs";
import Eredmény from "@/app/Eredmény";

export default class Megoldás {
  #eredmények: Eredmény[] = [];

  get bajnokokSzáma(): number {
    return this.#eredmények.length * 3;
  }

  get #farnciákSzáma(): number {
    let fő: number = 0;
    for (const e of this.#eredmények) {
      if (e.bajnokAutóOrszág == "Franciaország") fő++;
      if (e.bajnokMotorOrszág == "Franciaország") fő++;
      if (e.bajnokKamionOrszág == "Franciaország") fő++;
    }
    return fő;
  }

  get FranciaVersenyzőkSzázalék(): number {
    return (this.#farnciákSzáma / this.bajnokokSzáma) * 100;
  }

  get voltAzonosOrszágbólBajnokTrió(): boolean {
    for (const e of this.#eredmények) {
      if (e.bajnokAutóOrszág == e.bajnokMotorOrszág && e.bajnokAutóOrszág == e.bajnokKamionOrszág) {
        return true;
      }
    }
    return false;
  }

  get #versenyévek(): number[] {
    const évek: number[] = [];
    for (const e of this.#eredmények) {
      évek.push(e.év);
    }
    return évek;
  }

  get nemVoltVerseny(): string {
    const évek: number[] = [];
    for (let év = 1991; év <= 2020; év++) {
      if (!this.#versenyévek.includes(év)) évek.push(év);
    }
    return évek.join(" ");
  }

  get #bajnokStat(): Map<string, number> {
    const stat: Map<string, number> = new Map<string, number>();
    for (const e of this.#eredmények) {
      let régiÉrték: number | undefined = stat.get(e.bajnokNeveAutó);
      stat.set(e.bajnokNeveAutó, régiÉrték ? régiÉrték + 1 : 1);
      régiÉrték = stat.get(e.bajnokNeveMotor);
      stat.set(e.bajnokNeveMotor, régiÉrték ? régiÉrték + 1 : 1);
      régiÉrték = stat.get(e.bajnokNeveKamion);
      stat.set(e.bajnokNeveKamion, régiÉrték ? régiÉrték + 1 : 1);
    }
    return stat;
  }

  get bajnokMrGyőzelmekSzáma(): number {
    return Math.max(...this.#bajnokStat.values());
  }

  get banokMrNeve(): string {
    // Map (szótár) bejárása for-of ciklussal
    for (const [key, value] of this.#bajnokStat) {
      if (value == this.bajnokMrGyőzelmekSzáma) return key;
    }
    return "hiba";
  }

  get #kamionokStat(): Map<string, number> {
    const stat: Map<string, number> = new Map<string, number>();
    for (const e of this.#eredmények) {
      const régiÉrték: number | undefined = stat.get(e.kamionTípus);
      stat.set(e.kamionTípus, régiÉrték ? régiÉrték + 1 : 1);
    }
    return stat;
  }

  constructor(forrás: string) {
    const sorok: string[] = fs.readFileSync(forrás).toString().split("\n").slice(1);
    for (const sor of sorok) {
      const aktSor = sor.trim();
      if (aktSor.length > 0) this.#eredmények.push(new Eredmény(aktSor));
    }
  }

  kamiontípusokÍrása(állomány_neve: string): void {
    // Tömbök rendezése
    // =================
    // number[], vagy string[] típusú tömb rendezése a sort() metódussal:
    // növekvő sorrend: rendezettTömb: number[] = tömb.sort((a, b) => a - b);
    // csökkenő sorrend: rendezettTömb: number[] = tömb.sort((a, b) => b - a);

    // Fontos: A sort() metódus "helyben" (in place) rendez, azaz megváltoztatja a forrás tömböt, ezért nem szükséges új azonosítót (rendezettTömb) létrehozni a rendezett tömbnek, a régi azonosítót is használhatjuk

    // Szótárak (Map) rendezése: szótár -> tömb -> rendezett_tömb -> szótár
    // =====================================================================
    // 1. lépés: Tömbbé alakítjuk a szótárunkat: Array.from(this.#kamionokStat), mert a sort() metódus csak tömbökön érhető el, szótáraknak nincs ilyen
    
    // 2. lépés: az új tömb sort() metódusával rendezzük az adatokat, a rendezés kulcsa a tömb elemeinek második eleme (ez volt korábban a szótárban a value),
    // azaz itt a győzelmek száma  lesz: (a, b) => b[1] - a[1]
    // példa a rendezendő tömbre: [["Kamion1", 3], ["Kamion2", 5], ["Kamion3", 2]]

    // "a" és "b" a tömb egymás melletti elemeit jelölik, cserél, ha b[1] - a[1] negatív, nem cserél ha pozitív, vagy nulla
    
    // a szótár korábbi kulcsai a 0. indexekkel érhetők el az új tömbben: a[0], b[0]
    // a szótár korábbi értékei az 1. indexekkel érhetők el az új tömbben: a[1], b[1]
    // csökkenő sorrend értékek szerint: (a, b) => b[1] - a[1]
    // növekvő sorrend értékek szerint (a, b) => a[1] - b[1]
    // csökkenő sorrend kulcsok szerint: (a, b) => b[0] - a[0]
    // növekvő sorrend kulcsok szerint: (a, b) => a[0] - b[0])
    // Magyar "ábécé" rendezés string típusú kulcsok esetén: (a, b) => a[0].localeCompare(b[0])

    // 3. lépés: végül a rendezett tömböt visszaalakítjuk szótára: rendezettSzótár = new Map(rendezett_tömb)
    // Elvileg ez a lépés felesleges itt, mert a rendezett tömböt is bejárhatjuk for-of ciklussal
   
    const sortedMap = new Map(Array.from(this.#kamionokStat).sort((a, b) => b[1] - a[1]));
    const ki: string[] = [];
    // rendezett szótár bejárása:
    for (const [key, value] of sortedMap) {
      ki.push(`${key} - ${value}x`);
    }
    fs.writeFileSync(állomány_neve, ki.join("\r\n") + "\r\n");
  }
}
