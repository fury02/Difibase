import {Actor_CMC} from "../../actors_external/Actor_ic_cmc";
import {CyclesMarketConversionInfo, IcpXdrConversionRateCertifiedResponse} from "../../../common/interfaces/interfaces";
import {useAppDispatch} from "../../../redux/app/Hooks";

const digitMultiplier = 100000000;
const cyclesRecommend = BigInt(1200000000000);
const cmc = new Actor_CMC();

//https://github.com/papyrs/ic
export class CycleMarketPrice{

    public async icp_cycles_conversion_info(amount: String){
        let ac_cmc = await cmc.getActor();
        // const average_xdr_conversion = await ac_cmc.get_average_icp_xdr_conversion_rate();
        const xdr_conversion: IcpXdrConversionRateCertifiedResponse = await ac_cmc.get_icp_xdr_conversion_rate();
        const xdr_permyriad_per_icp = xdr_conversion.data.xdr_permyriad_per_icp;
        const CYCLES_PER_XDR = BigInt(1_000_000_000_000);
        let trillionRatio = (xdr_permyriad_per_icp * CYCLES_PER_XDR) / BigInt(10_000);

        const E8S_PER_ICP = BigInt(100000000);

        const e8ToCycleRatio = BigInt( trillionRatio / E8S_PER_ICP);
        const cyclesAmount = this.icpToE8s(amount) * e8ToCycleRatio;
        const oneTrillion = BigInt(1000000) * BigInt(1000000);

        let info = `${amount} ICP equals ${Number(cyclesAmount) / Number(oneTrillion)} (${cyclesAmount}) cycles`;
        return info;
    };

    public async get_cycle_market_info(amount: String): Promise<CyclesMarketConversionInfo> {
        let ac_cmc = await cmc.getActor();
        // const average_xdr_conversion = await ac_cmc.get_average_icp_xdr_conversion_rate();
        const xdr_conversion: IcpXdrConversionRateCertifiedResponse = await ac_cmc.get_icp_xdr_conversion_rate();
        const xdr_permyriad_per_icp = xdr_conversion.data.xdr_permyriad_per_icp;
        const CYCLES_PER_XDR = BigInt(1_000_000_000_000);
        let trillionRatio = (xdr_permyriad_per_icp * CYCLES_PER_XDR) / BigInt(10_000);

        const E8S_PER_ICP = BigInt(100000000);

        const e8ToCycleRatio = BigInt( trillionRatio / E8S_PER_ICP);
        const cyclesAmount = this.icpToE8s(amount) * e8ToCycleRatio;
        const oneTrillion = BigInt(1000000) * BigInt(1000000);

        let info = `${amount} ICP equals ${Number(cyclesAmount) / Number(oneTrillion)} (${cyclesAmount}) cycles`;

        let cmi: CyclesMarketConversionInfo = {
            cycles_conversion_info: info,
            cycles_amount: cyclesAmount,
            cycles_value: String(cyclesAmount)  };

        return cmi;
    };

    public icpToE8s(amount: String){
        const E8S_PER_ICP = BigInt(100000000);
        // Remove all instances of "," and "'".
        amount = amount.trim().replace(/[,']/g, '');
        // Verify that the string is of the format 1234.5678
        const regexMatch = amount.match(/\d*(\.\d*)?/);
        if (!regexMatch || regexMatch[0] !== amount) {
            throw new Error('INVALID_FORMAT');
        }
        const [integral_, fractional] = amount.split('.');
        const integral = BigInt(Number(integral_));
        let e8s = BigInt(0);
        if (integral) {
            try {
                e8s += BigInt(integral * E8S_PER_ICP);
            } catch {
                throw new Error('INVALID_FORMAT');
            }
        }
        if (fractional) {
            if (fractional.length > 8) {
                throw new Error('FRACTIONAL_MORE_THAN_8_DECIMALS');
            }
            try {
                e8s += BigInt(fractional.padEnd(8, '0'));
            } catch {
                throw new Error('INVALID_FORMAT');
            }
        }
        return e8s;
    };
};