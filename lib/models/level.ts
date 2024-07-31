export class Level {
    constructor(
        public id: string | null,
        public name: string,
        public price_myr: number,
        public price_usd: number,
        public price_gbp: number,
    ) { }

    static fromMap(data: Record<string, any>, id: string) {
        return new Level(
            id,
            data.name,
            data.price_myr,
            data.price_usd,
            data.price_gbp,
        );
    }

    toMap(): Record<string, any> {
        return {
            name: this.name,
            price_myr: this.price_myr,
            price_usd: this.price_usd,
            price_gbp: this.price_gbp,
        };
    }
}
