
 // SPDX-License-Identifier: MIT
 pragma solidity ^0.8.0;

 contract CharityDonation {

     // Stores information about a charity campaign
     struct Campaign {
         string title;
         string description;
         address payable organizer;
         uint256 goal;
         uint256 totalDonated;
         uint256 totalAllocated;
         uint256 totalSpent;
         bool active;
         uint256 createdAt;
     }

     // Stores individual donation information
     struct Donation {
         address donor;
         uint256 amount;
         uint256 timestamp;
     }

     // Stores allocated funds for a specific purpose
     struct Allocation {
         uint256 amount;
         uint256 remaining;
         string purpose;
         uint256 timestamp;
     }

     // Stores expenditure and payment information
     struct Expenditure {
         uint256 allocationId;
         address recipient;
         uint256 amount;
         string description;
         string proofHash;
         uint256 timestamp;
     }

     uint256 public campaignCount;

     mapping(uint256 => Campaign) private campaigns;

     mapping(uint256 => Donation[]) private donations;

     mapping(uint256 => Allocation[]) private allocations;

     mapping(uint256 => Expenditure[]) private expenditures;

     bool private locked;

     // Prevents reentrant payment calls
     modifier nonReentrant() {
         require(!locked, "Reentrant call");
         locked = true;
         _;
         locked = false;
     }

     // Allows only the creator of a campaign to manage it
     modifier onlyOrganizer(uint256 campaignId) {
         require(
             campaignId > 0 && campaignId <= campaignCount,
             "Campaign does not exist"
         );

         require(
             campaigns[campaignId].organizer == msg.sender,
             "Only campaign organizer"
         );

         _;
     }

     // Blockchain events for transparent transaction tracking
     event CampaignCreated(
         uint256 indexed campaignId,
         address indexed organizer,
         string title,
         uint256 goal
     );

     event DonationReceived(
         uint256 indexed campaignId,
         address indexed donor,
         uint256 amount,
         uint256 timestamp
     );

     event FundsAllocated(
         uint256 indexed campaignId,
         uint256 indexed allocationId,
         uint256 amount,
         string purpose
     );

     event ExpenditureRecorded(
         uint256 indexed campaignId,
         uint256 indexed allocationId,
         address indexed recipient,
         uint256 amount,
         string description,
         string proofHash
     );

     event CampaignStatusChanged(
         uint256 indexed campaignId,
         bool active
     );

     // 1. Create a new charity campaign
     function createCampaign(
         string calldata title,
         string calldata description,
         uint256 goal
     ) external returns (uint256) {

         require(bytes(title).length > 0, "Title required");
         require(bytes(description).length > 0, "Description required");
         require(goal > 0, "Goal must be greater than zero");

         campaignCount++;

         campaigns[campaignCount] = Campaign({
             title: title,
             description: description,
             organizer: payable(msg.sender),
             goal: goal,
             totalDonated: 0,
             totalAllocated: 0,
             totalSpent: 0,
             active: true,
             createdAt: block.timestamp
         });

         emit CampaignCreated(
             campaignCount,
             msg.sender,
             title,
             goal
         );

         return campaignCount;
     }

     // 2. Donate cryptocurrency to a campaign
     function donate(uint256 campaignId) external payable {

         require(
             campaignId > 0 && campaignId <= campaignCount,
             "Campaign does not exist"
         );

         Campaign storage campaign = campaigns[campaignId];

         require(campaign.active, "Campaign is inactive");
         require(msg.value > 0, "Donation must be greater than zero");

         campaign.totalDonated += msg.value;

         donations[campaignId].push(
             Donation({
                 donor: msg.sender,
                 amount: msg.value,
                 timestamp: block.timestamp
             })
         );

         emit DonationReceived(
             campaignId,
             msg.sender,
             msg.value,
             block.timestamp
         );
     }

     // 3. Allocate collected funds for a specific purpose
     function allocateFunds(
         uint256 campaignId,
         uint256 amount,
         string calldata purpose
     ) external onlyOrganizer(campaignId) {

         Campaign storage campaign = campaigns[campaignId];

         require(amount > 0, "Amount must be greater than zero");
         require(bytes(purpose).length > 0, "Purpose required");

         require(
             amount <= campaign.totalDonated - campaign.totalAllocated,
             "Insufficient unallocated funds"
         );

         campaign.totalAllocated += amount;

         uint256 allocationId = allocations[campaignId].length;

         allocations[campaignId].push(
             Allocation({
                 amount: amount,
                 remaining: amount,
                 purpose: purpose,
                 timestamp: block.timestamp
             })
         );

         emit FundsAllocated(
             campaignId,
             allocationId,
             amount,
             purpose
         );
     }

     // 4. Record an expense and transfer the actual funds
     function recordExpenditure(
         uint256 campaignId,
         uint256 allocationId,
         address payable recipient,
         uint256 amount,
         string calldata description,
         string calldata proofHash
     )
         external
         onlyOrganizer(campaignId)
         nonReentrant
     {

         require(
             allocationId < allocations[campaignId].length,
             "Allocation does not exist"
         );

         require(recipient != address(0), "Invalid recipient");
         require(amount > 0, "Amount must be greater than zero");
         require(bytes(description).length > 0, "Description required");
         require(bytes(proofHash).length > 0, "Proof hash required");

         Allocation storage allocation =
             allocations[campaignId][allocationId];

         require(
             amount <= allocation.remaining,
             "Exceeds allocated funds"
         );

         Campaign storage campaign = campaigns[campaignId];

         // Update records before making the external payment
         allocation.remaining -= amount;
         campaign.totalSpent += amount;

         // Transfer test ETH to the recipient
         (bool success, ) = recipient.call{value: amount}("");

         require(success, "Payment transfer failed");

         // Store the expenditure record
         expenditures[campaignId].push(
             Expenditure({
                 allocationId: allocationId,
                 recipient: recipient,
                 amount: amount,
                 description: description,
                 proofHash: proofHash,
                 timestamp: block.timestamp
             })
         );

         emit ExpenditureRecorded(
             campaignId,
             allocationId,
             recipient,
             amount,
             description,
             proofHash
         );
     }

     // 5. Activate or deactivate a campaign
     function setCampaignStatus(
         uint256 campaignId,
         bool status
     ) external onlyOrganizer(campaignId) {

         campaigns[campaignId].active = status;

         emit CampaignStatusChanged(campaignId, status);
     }

     // 6. Read complete campaign information
     function getCampaign(
         uint256 campaignId
     ) external view returns (Campaign memory) {

         require(
             campaignId > 0 && campaignId <= campaignCount,
             "Campaign does not exist"
         );

         return campaigns[campaignId];
     }

     // 7. Get the number of donations
     function getDonationCount(
         uint256 campaignId
     ) external view returns (uint256) {

         require(
             campaignId > 0 && campaignId <= campaignCount,
             "Campaign does not exist"
         );

         return donations[campaignId].length;
     }

     // 8. Read an individual donation
     function getDonation(
         uint256 campaignId,
         uint256 index
     ) external view returns (Donation memory) {

         require(
             index < donations[campaignId].length,
             "Donation does not exist"
         );

         return donations[campaignId][index];
     }

     // 9. Get the number of allocations
     function getAllocationCount(
         uint256 campaignId
     ) external view returns (uint256) {

         require(
             campaignId > 0 && campaignId <= campaignCount,
             "Campaign does not exist"
         );

         return allocations[campaignId].length;
     }

     // 10. Read an individual allocation
     function getAllocation(
         uint256 campaignId,
         uint256 allocationId
     ) external view returns (Allocation memory) {

         require(
             allocationId < allocations[campaignId].length,
             "Allocation does not exist"
         );

         return allocations[campaignId][allocationId];
     }

     // 11. Get the number of expenditures
     function getExpenditureCount(
         uint256 campaignId
     ) external view returns (uint256) {

         require(
             campaignId > 0 && campaignId <= campaignCount,
             "Campaign does not exist"
         );

         return expenditures[campaignId].length;
     }

     // 12. Read an individual expenditure
     function getExpenditure(
         uint256 campaignId,
         uint256 index
     ) external view returns (Expenditure memory) {

         require(
             index < expenditures[campaignId].length,
             "Expenditure does not exist"
         );

         return expenditures[campaignId][index];
     }
 }
