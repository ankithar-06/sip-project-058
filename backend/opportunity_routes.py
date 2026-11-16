from fastapi import APIRouter, Query
from typing import Optional, List
from database import opportunities_collection, format_doc

router = APIRouter(prefix="/api/opportunities", tags=["Government Opportunities Hub"])

# Real, verified Indian Government MSME schemes from official sources
VERIFIED_SCHEMES = [
    {
        "name": "Prime Minister's Employment Generation Programme (PMEGP)",
        "category": "Credit & Subsidy",
        "ministry": "Ministry of Micro, Small and Medium Enterprises (MSME) & KVIC",
        "description": "Credit-linked subsidy programme to generate self-employment opportunities through establishment of micro-enterprises in non-farm sectors.",
        "eligibility": "Individuals aged 18+ years; at least 8th standard pass for projects costing above ₹10 lakh in manufacturing and ₹5 lakh in service sector. Self Help Groups (SHGs) and registered institutions are also eligible.",
        "benefits": "Margin money subsidy of 25% (urban) to 35% (rural) for special categories; maximum project cost of ₹50 lakh for manufacturing and ₹20 lakh for service sector.",
        "application_info": "Apply online via KVIC e-portal with project report, caste/special category certificate, Aadhaar, and bank account details.",
        "official_link": "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp",
        "status": "Active",
    },
    {
        "name": "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)",
        "category": "Collateral-Free Loans",
        "ministry": "Ministry of MSME & SIDBI",
        "description": "Enables micro and small enterprises to access collateral-free institutional credit from member lending institutions.",
        "eligibility": "New and existing Micro and Small Enterprises (MSEs) engaged in manufacturing or service activities, including retail trade.",
        "benefits": "Guarantee cover up to 85% for loans up to ₹5 crore without third-party guarantee or collateral security; reduced guarantee fee for women entrepreneurs.",
        "application_info": "Approach eligible member banks/financial institutions directly with a viable business plan.",
        "official_link": "https://www.cgtmse.in/",
        "status": "Active",
    },
    {
        "name": "MSME Sustainable (ZED) Certification Scheme",
        "category": "Quality & Technology",
        "ministry": "Ministry of MSME",
        "description": "Encourages MSMEs to adopt Zero Defect Zero Effect manufacturing practices and enhance global competitiveness.",
        "eligibility": "All MSMEs having valid Udyam Registration engaged in the manufacturing sector.",
        "benefits": "Financial assistance of up to 80% for Micro, 60% for Small, and 50% for Medium enterprises on certification cost; additional 10% subsidy for women/SC/ST owned enterprises.",
        "application_info": "Register with Udyam number on the official ZED portal, take the pledge, and complete desktop assessment.",
        "official_link": "https://zed.msme.gov.in/",
        "status": "Active",
    },
    {
        "name": "Pradhan Mantri Mudra Yojana (PMMY)",
        "category": "Micro Credit",
        "ministry": "Department of Financial Services, Ministry of Finance",
        "description": "Provides loans up to ₹10 lakh to non-corporate, non-farm small and micro enterprises.",
        "eligibility": "Any Indian citizen having a business plan for a non-farm sector income generating activity such as manufacturing, processing, trading, or service sector.",
        "benefits": "Shishu (up to ₹50,000), Kishore (₹50,001 to ₹5 lakh), and Tarun (₹5 lakh to ₹10 lakh) loans with no collateral requirement and nominal interest rates.",
        "application_info": "Apply at any commercial bank, RRB, small finance bank, or MFI, or apply online via UdyamiMitra portal.",
        "official_link": "https://www.mudra.org.in/",
        "status": "Active",
    },
    {
        "name": "Procurement and Marketing Support (PMS) Scheme",
        "category": "Market Access",
        "ministry": "Ministry of MSME",
        "description": "Enhances the marketability of products and services produced and rendered by Micro and Small Enterprises.",
        "eligibility": "Manufacturing and service MSMEs with valid Udyam Registration.",
        "benefits": "Financial reimbursement up to 100% space rent for SC/ST/Women/NER entrepreneurs participating in trade fairs/exhibitions; assistance for vendor development programmes.",
        "application_info": "Submit application online through the MSME Champions portal before participating in sanctioned domestic trade fairs.",
        "official_link": "https://champions.gov.in/",
        "status": "Active",
    },
    {
        "name": "Stand-Up India Scheme",
        "category": "Inclusion & Startup",
        "ministry": "Ministry of Finance & SIDBI",
        "description": "Facilitates bank loans between ₹10 lakh and ₹1 crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch.",
        "eligibility": "SC/ST and/or women entrepreneurs setting up greenfield enterprises in manufacturing, services, agri-allied, or trading sector.",
        "benefits": "Composite loan (term loan and working capital) between ₹10 lakh and ₹100 lakh covering up to 85% of project cost with margin money convergence.",
        "application_info": "Apply directly through the Stand-Up Mitra portal or through any commercial bank branch.",
        "official_link": "https://www.standupmitra.in/",
        "status": "Active",
    },
    {
        "name": "Scheme for Promotion of Innovation, Rural Industry & Entrepreneurship (ASPIRE)",
        "category": "Incubation & Rural",
        "ministry": "Ministry of MSME",
        "description": "Sets up a network of technology centers and incubation centers to accelerate entrepreneurship and promote start-ups for innovation in rural and agro-industry.",
        "eligibility": "Rural youth, entrepreneurs, and institutions looking to establish Livelihood Business Incubators (LBIs) or Technology Business Incubators (TBIs).",
        "benefits": "One-time grant of 100% cost of plant and machinery up to ₹100 lakh for government agencies and ₹50 lakh for private agencies for setting up LBIs.",
        "application_info": "Proposals submitted online through the ASPIRE portal for review by the project appraisal committee.",
        "official_link": "https://aspire.msme.gov.in/",
        "status": "Active",
    },
]


def seed_opportunities_if_needed():
    """Seeds the database with verified government schemes if the collection is empty."""
    if opportunities_collection.count_documents({}) == 0:
        opportunities_collection.insert_many(VERIFIED_SCHEMES)
        print("Government opportunities initialized with verified official MSME schemes.")


@router.get("/")
def list_opportunities(
    category: Optional[str] = Query(None, description="Filter by scheme category"),
    search: Optional[str] = Query(None, description="Search by scheme name or keywords"),
):
    seed_opportunities_if_needed()
    query = {}
    if category and category.lower() != "all":
        query["category"] = {"$regex": f"^{category}$", "$options": "i"}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"eligibility": {"$regex": search, "$options": "i"}},
            {"benefits": {"$regex": search, "$options": "i"}},
        ]

    cursor = opportunities_collection.find(query)
    return [format_doc(doc) for doc in cursor]
