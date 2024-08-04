export class Level {
    constructor(
        public id: string | null,
        public name: string,
        public student_price_myr: number,
        public student_price_usd: number,
        public student_price_gbp: number,
        public tutor_price_myr: number,
        public tutor_price_usd: number,
        public tutor_price_gbp: number,
    ) { }

    static fromMap(data: Record<string, any>, id: string) {
        return new Level(
            id,
            data.name,
            data.student_price_myr,
            data.student_price_usd,
            data.student_price_gbp,
            data.tutor_price_myr,
            data.tutor_price_usd,
            data.tutor_price_gbp,
        );
    }

    toMap(): Record<string, any> {
        return {
            name: this.name,
            student_price_myr: this.student_price_myr,
            student_price_usd: this.student_price_usd,
            student_price_gbp: this.student_price_gbp,
            tutor_price_myr: this.tutor_price_myr,
            tutor_price_usd: this.tutor_price_usd,
            tutor_price_gbp: this.tutor_price_gbp,
        };
    }
}
