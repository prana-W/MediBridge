const hospitalData = [
    {
        "name": "All India Institute of Medical Sciences (AIIMS)",
        "state": "Delhi"
    },
    {
        "name": "Safdarjung Hospital",
        "state": "Delhi"
    },
    {
        "name": "Max Healthcare Saket",
        "state": "Delhi"
    },
    {
        "name": "Fortis Escorts Heart Institute",
        "state": "Delhi"
    },
    {
        "name": "Sir Ganga Ram Hospital",
        "state": "Delhi"
    },
    {
        "name": "Kokilaben Dhirubhai Ambani Hospital",
        "state": "Maharashtra"
    },
    {
        "name": "Tata Memorial Hospital",
        "state": "Maharashtra"
    },
    {
        "name": "Ruby Hall Clinic",
        "state": "Maharashtra"
    },
    {
        "name": "Deenanath Mangeshkar Hospital",
        "state": "Maharashtra"
    },
    {
        "name": "Jaslok Hospital",
        "state": "Maharashtra"
    },
    {
        "name": "Narayana Institute of Cardiac Sciences",
        "state": "Karnataka"
    },
    {
        "name": "Manipal Hospital",
        "state": "Karnataka"
    },
    {
        "name": "Fortis Hospital, Bannerghatta Road",
        "state": "Karnataka"
    },
    {
        "name": "St. John's Medical College Hospital",
        "state": "Karnataka"
    },
    {
        "name": "Apollo Hospitals, Mysuru",
        "state": "Karnataka"
    },
    {
        "name": "Apollo Hospitals, Greams Road",
        "state": "Tamil Nadu"
    },
    {
        "name": "Christian Medical College (CMC)",
        "state": "Tamil Nadu"
    },
    {
        "name": "MIOT International",
        "state": "Tamil Nadu"
    },
    {
        "name": "Kovai Medical Center and Hospital (KMCH)",
        "state": "Tamil Nadu"
    },
    {
        "name": "Government Stanley Hospital",
        "state": "Tamil Nadu"
    },
    {
        "name": "Sanjay Gandhi Postgraduate Institute (SGPGI)",
        "state": "Uttar Pradesh"
    },
    {
        "name": "King George's Medical University (KGMU)",
        "state": "Uttar Pradesh"
    },
    {
        "name": "Medanta - The Medicity, Lucknow",
        "state": "Uttar Pradesh"
    },
    {
        "name": "Apollo Hospitals, Noida",
        "state": "Uttar Pradesh"
    },
    {
        "name": "Sir Sunderlal Hospital, BHU",
        "state": "Uttar Pradesh"
    },
    {
        "name": "Apollo Gleneagles Hospitals",
        "state": "West Bengal"
    },
    {
        "name": "Fortis Hospital Anandapur",
        "state": "West Bengal"
    },
    {
        "name":"AMRI Hospitals",
        "state": "West Bengal"
    },
    {
        "name": "Peerless Hospital",
        "state": "West Bengal"
    },
    {
        "name": "SSKM Hospital",
        "state": "West Bengal"
    },
    {
        "name": "Sterling Hospital",
        "state": "Gujarat"
    },
    {
        "name": "CIMS Hospital",
        "state": "Gujarat"
    },
    {
        "name": "Apollo Hospitals, Ahmedabad",
        "state": "Gujarat"
    },
    {
        "name": "Kiran Multi Super Speciality Hospital",
        "state": "Gujarat"
    },
    {
        "name": "Shalby Hospitals",
        "state": "Gujarat"
    },
    {
        "name": "Sawai Man Singh (SMS) Hospital",
        "state": "Rajasthan"
    },
    {
        "name": "Fortis Escorts Hospital, Jaipur",
        "state": "Rajasthan"
    },
    {
        "name": "Narayana Multispeciality Hospital, Jaipur",
        "state": "Rajasthan"
    },
    {
        "name": "AIIMS Jodhpur",
        "state": "Rajasthan"
    },
    {
        "name": "Mahatma Gandhi Hospital, Jaipur",
        "state": "Rajasthan"
    },
    {
        "name": "Lakeshore Hospital",
        "state": "Kerala"
    },
    {
        "name": "Amrita Institute of Medical Sciences (AIMS)",
        "state":"Kerala"
    },
    {
        "name": "Aster Medcity",
        "state": "Kerala"
    },
    {
        "name": "Kerala Institute of Medical Sciences (KIMS)",
        "state": "Kerala"
    },
    {
        "name": "MIMS Hospital",
        "state": "Kerala"
    },
    {
        "name": "Yashoda Hospitals",
        "state": "Telangana"
    },
    {
        "name": "Apollo Hospitals Jubilee Hills",
        "state": "Telangana"
    },
    {
        "name": "Care Hospitals",
        "state": "Telangana"
    },
    {
        "name": "Continental Hospitals",
        "state": "Telangana"
    },
    {
        "name": "Nizam's Institute of Medical Sciences (NIMS)",
        "state": "Telangana"
    },
    {
        "name": "King George Hospital",
        "state": "Andhra Pradesh"
    },
    {
        "name": "Apollo Hospitals, Visakhapatnam",
        "state": "Andhra Pradesh"
    },
    {
        "name": "Manipal Hospitals, Vijayawada",
        "state": "Andhra Pradesh"
    },
    {
        "name": "Care Hospitals, Guntur",
        "state": "Andhra Pradesh"
    },
    {
        "name": "Government General Hospital, Vijayawada",
        "state": "Andhra Pradesh"
    },
    {
        "name": "AIIMS Bhopal",
        "state": "Madhya Pradesh"
    },
    {
        "name": "Bansal Hospital",
        "state": "Madhya Pradesh"
    },
    {
        "name": "Apollo Hospitals, Indore",
        "state": "Madhya Pradesh"
    },
    {
        "name": "Choithram Hospital",
        "state": "Madhya Pradesh"
    },
    {
        "name": "City Hospital, Jabalpur",
        "state": "Madhya Pradesh"
    },
    {
        "name": "Post Graduate Institute of Medical Education (PGIMER)",
        "state": "Punjab"
    },
    {
        "name": "Fortis Hospital, Mohali",
        "state": "Punjab"
    },
    {
        "name": "Dayanand Medical College & Hospital (DMCH)",
        "state": "Punjab"
    },
    {
        "name": "Apollo Hospitals, Amritsar",
        "state": "Punjab"
    },
    {
        "name": "Government Medical College, Patiala",
        "state": "Punjab"
    },
    {
        "name": "AIIMS Patna",
        "state": "Bihar"
    },
    {
        "name": "Paras HMRI Hospital",
        "state": "Bihar"
    },
    {
        "name": "Indira Gandhi Institute of Medical Sciences (IGIMS)",
        "state": "Bihar"
    },
    {
        "name": "Ford Hospital",
        "state": "Bihar"
    },
    {
        "name": "Patna Medical College and Hospital (PMCH)",
        "state": "Bihar"
    },
    {
        "name": "Apollo Hospitals, Guwahati",
        "state": "Assam"
    },
    {
        "name": "Narayana Superspeciality Hospital",
        "state": "Assam"
    },
    {
        "name": "Gauhati Medical College and Hospital (GMCH)",
        "state": "Assam"
    },
    {
        "name": "Dispur Polyclinic",
        "state": "Assam"
    },
    {
        "name": "Hayat Hospital",
        "state": "Assam"
    },
    {
        "name": "Tata Medical Hospital",
        "state": "Jharkhand"
    },
    {
        "name": "BMH",
        "state": "Jharkhand"
    }
]

export default hospitalData;