
import { expect } from "chai";
import hre from "hardhat";

const { ethers } = await hre.network.create();

describe("Charity Donation Tracking System", function () {

    let charity: any;
    let organizer: any;
    let donor: any;
    let outsider: any;
    let recipient: any;

    const goal = ethers.parseEther("5");

    beforeEach(async function () {
        const signers = await ethers.getSigners();

        organizer = signers[0];
        donor = signers[1];
        outsider = signers[2];
        recipient = signers[3];

        charity = await ethers.deployContract("CharityDonation");
        await charity.waitForDeployment();
    });

    // TEST 1: Campaign creation
    it("Should create a new charity campaign", async function () {

        await expect(
            charity.createCampaign(
                "Flood Relief",
                "Helping flood affected families",
                goal
            )
        ).to.emit(charity, "CampaignCreated");

        const campaign = await charity.getCampaign(1);

        expect(campaign.title).to.equal("Flood Relief");
        expect(campaign.organizer).to.equal(organizer.address);
        expect(campaign.goal).to.equal(goal);
        expect(campaign.active).to.equal(true);
    });

    // TEST 2: Donation functionality
    it("Should accept donations and record donor details", async function () {

        await charity.createCampaign(
            "Flood Relief",
            "Helping families",
            goal
        );

        const amount = ethers.parseEther("1");

        await expect(
            charity.connect(donor).donate(1, { value: amount })
        ).to.emit(charity, "DonationReceived");

        const campaign = await charity.getCampaign(1);
        const donation = await charity.getDonation(1, 0);

        expect(campaign.totalDonated).to.equal(amount);
        expect(donation.donor).to.equal(donor.address);
        expect(donation.amount).to.equal(amount);

        expect(
            await ethers.provider.getBalance(await charity.getAddress())
        ).to.equal(amount);
    });

    // TEST 3: Only organizer can allocate funds
    it("Should allow only the organizer to allocate funds", async function () {

        await charity.createCampaign(
            "Flood Relief",
            "Helping families",
            goal
        );

        await charity.connect(donor).donate(1, {
            value: ethers.parseEther("2")
        });

        await expect(
            charity.connect(outsider).allocateFunds(
                1,
                ethers.parseEther("1"),
                "Food supplies"
            )
        ).to.be.revertedWith("Only campaign organizer");

        await expect(
            charity.allocateFunds(
                1,
                ethers.parseEther("1"),
                "Food supplies"
            )
        ).to.emit(charity, "FundsAllocated");

        const allocation = await charity.getAllocation(1, 0);

        expect(allocation.amount).to.equal(ethers.parseEther("1"));
        expect(allocation.remaining).to.equal(ethers.parseEther("1"));
        expect(allocation.purpose).to.equal("Food supplies");
    });

    // TEST 4: Prevent excess allocation
    it("Should prevent allocation beyond available donations", async function () {

        await charity.createCampaign(
            "Flood Relief",
            "Helping families",
            goal
        );

        await charity.connect(donor).donate(1, {
            value: ethers.parseEther("1")
        });

        await charity.allocateFunds(
            1,
            ethers.parseEther("0.6"),
            "Food supplies"
        );

        await expect(
            charity.allocateFunds(
                1,
                ethers.parseEther("0.5"),
                "Medical supplies"
            )
        ).to.be.revertedWith("Insufficient unallocated funds");
    });

    // TEST 5: Record expenditure and transfer funds
    it("Should record expenditure and transfer funds to recipient", async function () {

        await charity.createCampaign(
            "Flood Relief",
            "Helping families",
            goal
        );

        await charity.connect(donor).donate(1, {
            value: ethers.parseEther("2")
        });

        await charity.allocateFunds(
            1,
            ethers.parseEther("1"),
            "Food supplies"
        );

        const expense = ethers.parseEther("0.4");
        const recipientBalanceBefore =
            await ethers.provider.getBalance(recipient.address);

        await expect(
            charity.recordExpenditure(
                1,
                0,
                recipient.address,
                expense,
                "Purchased food packets",
                "QmExampleDocumentHash123"
            )
        ).to.emit(charity, "ExpenditureRecorded");

        const recipientBalanceAfter =
            await ethers.provider.getBalance(recipient.address);

        const expenditure = await charity.getExpenditure(1, 0);
        const allocation = await charity.getAllocation(1, 0);
        const campaign = await charity.getCampaign(1);

        expect(recipientBalanceAfter - recipientBalanceBefore).to.equal(expense);
        expect(expenditure.amount).to.equal(expense);
        expect(expenditure.description).to.equal("Purchased food packets");
        expect(expenditure.proofHash).to.equal("QmExampleDocumentHash123");
        expect(allocation.remaining).to.equal(ethers.parseEther("0.6"));
        expect(campaign.totalSpent).to.equal(expense);
    });

    // TEST 6: Prevent expenditure beyond allocation
    it("Should prevent spending more than allocated funds", async function () {

        await charity.createCampaign(
            "Flood Relief",
            "Helping families",
            goal
        );

        await charity.connect(donor).donate(1, {
            value: ethers.parseEther("1")
        });

        await charity.allocateFunds(
            1,
            ethers.parseEther("0.5"),
            "Food supplies"
        );

        await expect(
            charity.recordExpenditure(
                1,
                0,
                recipient.address,
                ethers.parseEther("0.8"),
                "Food purchase",
                "QmExampleHash"
            )
        ).to.be.revertedWith("Exceeds allocated funds");
    });

    // TEST 7: Campaign status
    it("Should prevent donations to an inactive campaign", async function () {

        await charity.createCampaign(
            "Flood Relief",
            "Helping families",
            goal
        );

        await charity.setCampaignStatus(1, false);

        await expect(
            charity.connect(donor).donate(1, {
                value: ethers.parseEther("1")
            })
        ).to.be.revertedWith("Campaign is inactive");
    });

});
