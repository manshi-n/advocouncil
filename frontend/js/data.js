// Mock lawyer database
const lawyersData = [
    {
        id: 1,
        name: "Adv. Rajesh Sharma",
        specialization: "Criminal Law",
        description: "Senior criminal defense attorney with expertise in high-profile cases. Former public prosecutor turned defense lawyer with exceptional courtroom skills.",
        rating: 4.9,
        experience: 18,
        location: "New Delhi",
        casesWon: 342,
        hourlyRate: 250,
        email: "rajesh.sharma@advocouncil.com",
        phone: "+91 98765 43210",
        fullBio: "With 18 years of experience in criminal law, Adv. Rajesh Sharma has successfully defended numerous high-profile cases. His expertise includes bail applications, trial representation, and criminal appeals."
    },
    {
        id: 2,
        name: "Adv. Priya Mehta",
        specialization: "Family Law",
        description: "Compassionate family law specialist handling divorce, custody, and adoption cases. Known for achieving amicable settlements.",
        rating: 4.7,
        experience: 12,
        location: "Mumbai",
        casesWon: 215,
        hourlyRate: 200,
        email: "priya.mehta@advocouncil.com",
        phone: "+91 98765 43211",
        fullBio: "Adv. Priya Mehta specializes in family law with a focus on mediation and collaborative law. She has helped hundreds of families navigate difficult transitions with dignity."
    },
    {
        id: 3,
        name: "Adv. Arun Kumar",
        specialization: "Corporate Law",
        description: "Corporate law expert advising Fortune 500 companies on mergers, acquisitions, and compliance. Harvard Law graduate.",
        rating: 4.8,
        experience: 15,
        location: "Bangalore",
        casesWon: 189,
        hourlyRate: 350,
        email: "arun.kumar@advocouncil.com",
        phone: "+91 98765 43212",
        fullBio: "A Harvard Law School graduate, Adv. Arun Kumar brings international expertise to corporate legal matters. He specializes in cross-border transactions and regulatory compliance."
    },
    {
        id: 4,
        name: "Adv. Sneha Reddy",
        specialization: "Intellectual Property",
        description: "IP law specialist protecting patents, trademarks, and copyrights. Helped startups secure over 500 patents.",
        rating: 4.6,
        experience: 10,
        location: "Hyderabad",
        casesWon: 156,
        hourlyRate: 280,
        email: "sneha.reddy@advocouncil.com",
        phone: "+91 98765 43213",
        fullBio: "Adv. Sneha Reddy is a leading IP attorney with expertise in patent filing, trademark registration, and copyright protection. She has worked with numerous tech startups."
    },
    {
        id: 5,
        name: "Adv. Vikram Desai",
        specialization: "Cyber Law",
        description: "Emerging leader in cyber law and digital privacy. Expert in data protection regulations, cybercrime defense, and IT Act cases.",
        rating: 4.7,
        experience: 8,
        location: "Kolkata",
        casesWon: 95,
        hourlyRate: 230,
        email: "vikram.desai@advocouncil.com",
        phone: "+91 98765 43214",
        fullBio: "Specializing in cyber law, Adv. Vikram Desai handles cases related to data breaches, online fraud, and digital privacy violations. He is certified in information security."
    },
    {
        id: 6,
        name: "Adv. Mohammed Khan",
        specialization: "Real Estate Law",
        description: "Veteran real estate attorney handling property disputes, land acquisition, and RERA compliance cases across India.",
        rating: 4.8,
        experience: 20,
        location: "Chennai",
        casesWon: 410,
        hourlyRate: 220,
        email: "mohammed.khan@advocouncil.com",
        phone: "+91 98765 43215",
        fullBio: "With two decades of experience, Adv. Mohammed Khan is an authority on real estate law. He has successfully resolved complex property disputes and RERA complaints."
    },
    {
        id: 7,
        name: "Adv. Kavita Singh",
        specialization: "Tax Law",
        description: "Tax law expert specializing in corporate taxation, GST disputes, and international tax planning. Former IRS officer.",
        rating: 4.5,
        experience: 14,
        location: "Pune",
        casesWon: 178,
        hourlyRate: 300,
        email: "kavita.singh@advocouncil.com",
        phone: "+91 98765 43216",
        fullBio: "A former IRS officer, Adv. Kavita Singh brings unique insights to tax litigation. She specializes in GST compliance, income tax appeals, and international tax treaties."
    }
];

// Save to localStorage for persistence
if (!localStorage.getItem('lawyers')) {
    localStorage.setItem('lawyers', JSON.stringify(lawyersData));
}

// Helper function to get all lawyers
function getAllLawyers() {
    return JSON.parse(localStorage.getItem('lawyers')) || lawyersData;
}

// Helper function to get lawyer by ID
function getLawyerById(id) {
    const lawyers = getAllLawyers();
    return lawyers.find(lawyer => lawyer.id === parseInt(id));
}