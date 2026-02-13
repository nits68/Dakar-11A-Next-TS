export default class Eredmény {
    // év;autóversenyző;autó típus;motorversenyző;motor típus;kamionversenyző;kamion típus
    #év: number;
    #autóversenyző: string;
    #autóTípus: string;
    #motorversenyző: string;
    #motorTípus: string;
    #kamionversenyző: string;
    #kamionTípus: string;

    
    // 4. feladathoz:
    get év(): number {
        return this.#év;
    }

    // 7. feladathoz:
    get kamionTípus(): string {
        return this.#kamionTípus;
    }

    get bajnokAutóOrszág(): string {
        return this.#autóversenyző.split(" ")[0];
    }

    get bajnokMotorOrszág(): string {
        return this.#motorversenyző.split(" ")[0];
    }

    get bajnokKamionOrszág(): string {
        return this.#kamionversenyző.split(" ")[0];
    }

    get bajnokNeveAutó(): string {
        return this.#autóversenyző.split(" ").slice(1).join(" ");
    }

    get bajnokNeveMotor(): string {
        return this.#motorversenyző.split(" ").slice(1).join(" ");
    }

    get bajnokNeveKamion(): string {
        return this.#kamionversenyző.split(" ").slice(1).join(" ");
    }

    constructor(sor: string) {
        const m: string[] = sor.split(";");
        this.#év = Number(m[0]);
        this.#autóversenyző = m[1];
        this.#autóTípus = m[2]
        this.#motorversenyző = m[3]
        this.#motorTípus = m[4]
        this.#kamionversenyző = m[5]
        this.#kamionTípus = m[6]
    }

}
  
