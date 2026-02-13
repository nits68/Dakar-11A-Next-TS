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
    const sorok: string[] = fs.readFileSync(forrás).toString().split("\r\n").slice(1);
    for (const sor of sorok) {
      this.#eredmények.push(new Eredmény(sor));
    }
  }

  kamiontípusokÍrása(állomány_neve: string): void {
    // Rendezett szótár a kulcsok szerint:
    // 1. lépés: Tömbbé alakítjuk a szótárunkat (Array.from(szótár)),
    // 2. majd a szótár sort() metódusával rendezzük,
    // 3. végül vissza szótárba(new Map(tömb))
    // kulcsok elérése: a[0], b[0]
    // értékek elérése: a[1], b[1]
    const sortedMap = new Map(Array.from(this.#kamionokStat).sort((a, b) => b[1] - a[1]));
    const ki: string[] = [];
    // rendezett szótár bejárása:
    for (const [key, value] of sortedMap) {
      ki.push(`${key} - ${value}x`);
    }
    fs.writeFileSync(állomány_neve, ki.join("\r\n") + "\r\n");
  }
}
