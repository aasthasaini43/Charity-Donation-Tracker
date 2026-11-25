
import { useState } from "react";
import {
  LayoutDashboard,
  HeartHandshake,
  HandCoins,
  ChartNoAxesCombined,
  ReceiptText,
  ShieldCheck,
  Wallet,
  Bell,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  ExternalLink,
  Menu,
  X,
  Users,
  Clock3,
  CircleDollarSign,
  CheckCircle2,
} from "lucide-react";
import "./App.css";

const navigation = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Campaigns", icon: HeartHandshake },
  { name: "Donations", icon: HandCoins },
  { name: "Fund Allocation", icon: ChartNoAxesCombined },
  { name: "Expenditure", icon: ReceiptText },
  { name: "Verification", icon: ShieldCheck },
];

const campaigns = [
  {
    title: "Education for Every Child",
    category: "Education",
    raised: 3.8,
    goal: 5,
    donors: 124,
    color: "purple",
    initials: "ED",
  },
  {
    title: "Community Food Relief",
    category: "Food & Hunger",
    raised: 4.2,
    goal: 6,
    donors: 98,
    color: "orange",
    initials: "FR",
  },
  {
    title: "Healthcare for All",
    category: "Healthcare",
    raised: 2.5,
    goal: 4,
    donors: 76,
    color: "blue",
    initials: "HC",
  },
];

const transactions = [
  {
    name: "Rahul Sharma",
    campaign: "Education for Every Child",
    amount: "+ 0.25 ETH",
    date: "Today, 10:42 AM",
    type: "donation",
    initials: "RS",
  },
  {
    name: "Priya Mehta",
    campaign: "Community Food Relief",
    amount: "+ 0.50 ETH",
    date: "Today, 09:18 AM",
    type: "donation",
    initials: "PM",
  },
  {
    name: "Food Distribution Trust",
    campaign: "Community Food Relief",
    amount: "- 0.30 ETH",
    date: "Yesterday, 04:30 PM",
    type: "expense",
    initials: "FT",
  },
  {
    name: "Aarav Verma",
    campaign: "Healthcare for All",
    amount: "+ 0.15 ETH",
    date: "Yesterday, 11:15 AM",
    type: "donation",
    initials: "AV",
  },
];

function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotice, setShowNotice] = useState(false);

  const handleNavigation = (page) => {
    setActivePage(page);
    setMenuOpen(false);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <HeartHandshake size={25} />
          </div>
          <div>
            <h2>GiveLedger</h2>
            <span>Transparent Giving</span>
          </div>
          <button
            className="close-menu"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="nav-label">MENU</div>

        <nav className="navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${
                  activePage === item.name ? "active" : ""
                }`}
                onClick={() => handleNavigation(item.name)}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">
              <ShieldCheck size={21} />
            </div>
            <h4>Giving with trust</h4>
            <p>Every transaction is recorded for transparency.</p>
            <button onClick={() => handleNavigation("Verification")}>
              Learn more <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="profile">
            <div className="profile-avatar">AD</div>
            <div className="profile-details">
              <strong>Admin User</strong>
              <span>Platform Administrator</span>
            </div>
          </div>
        </div>
      </aside>

      {menuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-toggle"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div className="breadcrumb">
              <span>Pages</span>
              <span>/</span>
              <strong>{activePage}</strong>
            </div>
          </div>

          <div className="topbar-right">
            <div className="search-box">
              <Search size={17} />
              <input placeholder="Search anything..." />
              <span>⌘ K</span>
            </div>

            <button
              className="icon-button notification-button"
              onClick={() => setShowNotice(!showNotice)}
              aria-label="Notifications"
            >
              <Bell size={19} />
              <i />
            </button>

            <button
              className="wallet-button"
              onClick={() => setShowNotice(true)}
            >
              <Wallet size={17} />
              Connect Wallet
            </button>
          </div>
        </header>

        {showNotice && (
          <div className="notice">
            Wallet integration will be enabled in a later development step.
            <button onClick={() => setShowNotice(false)}>
              <X size={15} />
            </button>
          </div>
        )}

        {activePage === "Overview" ? (
          <div className="dashboard">
            <section className="page-heading">
              <div>
                <span className="eyebrow">YOUR CHARITY DASHBOARD</span>
                <h1>Good things happen when we give.</h1>
                <p>
                  Track donations, monitor fund allocation and see the impact
                  of transparent giving.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={() => handleNavigation("Campaigns")}
              >
                <Plus size={18} /> Explore Campaigns
              </button>
            </section>

            <section className="hero-banner">
              <div className="hero-content">
                <span className="hero-tag">
                  <ShieldCheck size={15} /> BLOCKCHAIN POWERED TRANSPARENCY
                </span>
                <h2>Every contribution tells a story.</h2>
                <p>
                  A transparent way to donate, track every fund and see where
                  your generosity goes.
                </p>
                <button
                  className="hero-button"
                  onClick={() => handleNavigation("Verification")}
                >
                  Explore transparency <ArrowUpRight size={16} />
                </button>
              </div>
              <div className="hero-decoration">
                <div className="hero-circle circle-one" />
                <div className="hero-circle circle-two" />
                <div className="hero-symbol">
                  <HeartHandshake size={72} strokeWidth={1.3} />
                </div>
                <div className="floating-check">
                  <CheckCircle2 size={22} />
                  <span>Verified giving</span>
                </div>
              </div>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-top">
                  <span>Total Donations</span>
                  <div className="stat-icon green">
                    <HandCoins size={20} />
                  </div>
                </div>
                <h2>10.50 ETH</h2>
                <span className="stat-note">
                  Across all campaigns
                </span>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span>Funds Allocated</span>
                  <div className="stat-icon purple">
                    <ChartNoAxesCombined size={20} />
                  </div>
                </div>
                <h2>6.20 ETH</h2>
                <span className="stat-note">
                  For verified purposes
                </span>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span>Total Expenditure</span>
                  <div className="stat-icon orange">
                    <ReceiptText size={20} />
                  </div>
                </div>
                <h2>4.30 ETH</h2>
                <span className="stat-note">
                  Recorded expenses
                </span>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span>Active Donors</span>
                  <div className="stat-icon blue">
                    <Users size={20} />
                  </div>
                </div>
                <h2>298</h2>
                <span className="stat-note">
                  People making a difference
                </span>
              </div>
            </section>

            <section className="content-grid">
              <div className="panel campaigns-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Active Campaigns</h3>
                    <p>Making an impact, one donation at a time.</p>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => handleNavigation("Campaigns")}
                  >
                    View all <ArrowUpRight size={15} />
                  </button>
                </div>

                <div className="campaign-list">
                  {campaigns.map((campaign) => (
                    <div className="campaign-card" key={campaign.title}>
                      <div className={`campaign-art ${campaign.color}`}>
                        <HeartHandshake size={27} />
                      </div>
                      <div className="campaign-info">
                        <span className="category">
                          {campaign.category}
                        </span>
                        <h4>{campaign.title}</h4>
                        <div className="progress-track">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${
                                (campaign.raised / campaign.goal) * 100
                              }%`,
                            }}
                          />
                        </div>
                        <div className="campaign-meta">
                          <span>
                            <strong>{campaign.raised} ETH</strong> raised
                          </span>
                          <span>Goal: {campaign.goal} ETH</span>
                        </div>
                        <div className="donor-count">
                          <Users size={14} /> {campaign.donors} donors
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel transparency-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Fund Transparency</h3>
                    <p>Where the donations stand.</p>
                  </div>
                  <ShieldCheck size={21} className="verified-icon" />
                </div>

                <div className="fund-total">
                  <span>Total funds collected</span>
                  <h2>10.50 <small>ETH</small></h2>
                </div>

                <div className="fund-bar">
                  <div className="fund-used" />
                </div>

                <div className="fund-legend">
                  <div>
                    <i className="legend-green" />
                    <span>Spent</span>
                    <strong>4.30 ETH</strong>
                  </div>
                  <div>
                    <i className="legend-purple" />
                    <span>Allocated, unspent</span>
                    <strong>1.90 ETH</strong>
                  </div>
                  <div>
                    <i className="legend-gray" />
                    <span>Unallocated</span>
                    <strong>4.30 ETH</strong>
                  </div>
                </div>

                <div className="transparency-note">
                  <ShieldCheck size={17} />
                  <span>
                    Records are designed to be verifiable on the blockchain.
                  </span>
                </div>

                <button
                  className="outline-button"
                  onClick={() => handleNavigation("Verification")}
                >
                  View verification records <ExternalLink size={15} />
                </button>
              </div>
            </section>

            <section className="panel activity-panel">
              <div className="panel-heading">
                <div>
                  <h3>Recent Transactions</h3>
                  <p>A quick look at recent platform activity.</p>
                </div>
                <button
                  className="text-button"
                  onClick={() => handleNavigation("Donations")}
                >
                  View history <ArrowUpRight size={15} />
                </button>
              </div>

              <div className="transaction-table">
                <div className="table-header">
                  <span>NAME / ORGANISATION</span>
                  <span>CAMPAIGN</span>
                  <span>DATE</span>
                  <span>AMOUNT</span>
                  <span>STATUS</span>
                </div>

                {transactions.map((transaction, index) => (
                  <div className="table-row" key={index}>
                    <div className="person-cell">
                      <div className="person-avatar">
                        {transaction.initials}
                      </div>
                      <strong>{transaction.name}</strong>
                    </div>
                    <span className="campaign-name">
                      {transaction.campaign}
                    </span>
                    <span className="date-cell">
                      <Clock3 size={14} /> {transaction.date}
                    </span>
                    <strong
                      className={
                        transaction.type === "donation"
                          ? "amount-positive"
                          : "amount-negative"
                      }
                    >
                      {transaction.amount}
                    </strong>
                    <span className="status-pill">
                      <CheckCircle2 size={13} /> Recorded
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <footer className="footer">
              <span>© 2026 GiveLedger. Built for transparent giving.</span>
              <span>
                <ShieldCheck size={14} /> Blockchain-powered transparency
              </span>
            </footer>
          </div>
        ) : (
          <section className="coming-soon">
            <div className="coming-icon">
              <ShieldCheck size={34} />
            </div>
            <span className="eyebrow">GIVELEDGER PLATFORM</span>
            <h1>{activePage}</h1>
            <p>
              This section is part of our charity tracking system. We'll build
              its complete functionality and connect it to the blockchain in
              the upcoming development steps.
            </p>
            <button
              className="primary-button"
              onClick={() => handleNavigation("Overview")}
            >
              <LayoutDashboard size={17} /> Back to Overview
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
