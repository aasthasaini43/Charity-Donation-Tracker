
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CharityDonationModule", (m) => {

    const charityDonation = m.contract("CharityDonation");

    return { charityDonation };

});
