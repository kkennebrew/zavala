const directoryData = [
    {
        department: "Agrilife Extension",
        contacts: [
            { first: "Leslie", last: "Dominguez", ext: "121", phone: "830-374-2883", fax: "830-374-3351" },
            { first: "Mariana", last: "Vargas", ext: "141", phone: "830-374-2883", fax: "830-374-3351" }
        ]
    },
    {
        department: "Commissioner Pct. 1",
        contacts: [
            { first: "Joe", last: "Cruz", phone: "830-374-3526" },
            { first: "Arturo", last: "DeLeon", phone: "830-374-6463" },
            { first: "Danny", last: "Garza", phone: "830-374-6456" },
            { first: "Kevin", last: "Maldonado", phone: "830-374-6371" }
        ]
    },
    {
        department: "Commissioner Pct. 2",
        contacts: [
            { first: "Raul", last: "Gomez", phone: "830-374-3526" }
        ]
    },
    {
        department: "Commissioner Pct. 3",
        contacts: [
            { first: "Mark", last: "Belmarez", phone: "830-374-3526" }
        ]
    },
    {
        department: "Commissioner Pct. 4",
        contacts: [
            { first: "Florencio", last: "Melendrez", phone: "830-374-3526" }
        ]
    },
    {
        department: "County Attorney",
        contacts: [
            { first: "Eduardo", last: "Serna", ext: "226", phone: "830-374-3734", fax: "830-374-3007" },
            { first: "Letisia", last: "Velasquez", ext: "225", phone: "830-374-3734", fax: "830-374-3007" }
        ]
    },
    {
        department: "County Auditor",
        contacts: [
            { first: "Carlos", last: "Pereda", ext: "230", phone: "830-374-2214", fax: "830-374-2634" },
            { first: "Yolanda R.", last: "Tejada", ext: "228", phone: "830-374-2214", fax: "830-374-2634" },
            { first: "Norma", last: "Tovar", ext: "227", phone: "830-374-2214", fax: "830-374-2634" }
        ]
    },
    {
        department: "County Clerk",
        contacts: [
            { first: "Michelle", last: "Bonilla", ext: "256", phone: "830-374-2331", fax: "830-374-5955" },
            { first: "Ismenee", last: "Bosquez", ext: "252", phone: "830-374-2331" },
            { first: "Maria", last: "Bustamante", ext: "254", phone: "830-374-2331", fax: "830-374-5955" },
            { first: "Andrea", last: "Loera", ext: "253", phone: "830-374-2331" }
        ]
    },
    {
        department: "County Judge",
        contacts: [
            { first: "Janey", last: "Cervantez", ext: "265", phone: "830-374-3810", fax: "830-448-3144" },
            { first: "Jesse", last: "Gonzales", phone: "830-448-3144", fax: "830-448-3144" },
            { first: "Noelia", last: "Ramirez", ext: "257", phone: "830-374-3810", fax: "830-448-3144" }
        ]
    },
    {
        department: "County Treasurer",
        contacts: [
            { first: "Adryana", last: "Cantu", ext: "243", phone: "830-374-2442", fax: "830-374-9615" },
            { first: "Elizabeth", last: "Tovar", ext: "244", phone: "830-374-2442", fax: "830-374-9615" }
        ]
    },
    {
        department: "District Clerk",
        contacts: [
            { first: "Dayna", last: "Contreras", ext: "222", phone: "830-374-3456", fax: "830-374-2632" },
            { first: "Martina", last: "Delgado", ext: "221", phone: "830-374-3456", fax: "830-374-2632" },
            { first: "Rachel", last: "Ramirez", ext: "224", phone: "830-374-3456", fax: "830-374-2632" }
        ]
    },
    {
        department: "Justice of the Peace Pct. 1",
        contacts: [
            { first: "Erica P.", last: "Ayala", phone: "830-376-4609", fax: "830-376-9021" },
            { first: "Judge Paula", last: "DeLeon", phone: "830-376-4609", fax: "830-376-9021" }
        ]
    },
    {
        department: "Justice of the Peace Pct. 2",
        contacts: [
            { first: "Judge Rosie", last: "Briseno", phone: "830-374-2116", fax: "830-374-2895" },
            { first: "Maricela", last: "Flores", phone: "830-374-2116", fax: "830-374-2895" }
        ]
    },
    {
        department: "Justice of the Peace Pct. 3",
        contacts: [
            { first: "Asaneth", last: "Almeida", ext: "213", phone: "830-374-5197" },
            { first: "Judge Mike", last: "Amoles", phone: "830-374-5197", fax: "830-947-7393" }
        ]
    },
    {
        department: "Justice of the Peace Pct. 4",
        contacts: [
            { first: "Judge Susie", last: "Bermea", phone: "830-365-4276", fax: "830-365-4702" },
            { first: "Julia", last: "Velasquez", phone: "830-365-4494", fax: "830-365-4702" }
        ]
    },
    {
        department: "Nutrition Center",
        contacts: [
            { first: "Esperanza", last: "Garza", phone: "830-374-2336" }
        ]
    },
    {
        department: "Road and Bridge Crystal City",
        contacts: [
            { first: "Jessica", last: "Acosta", phone: "830-374-3526" }
        ]
    },
    {
        department: "Sheriff's Office",
        contacts: [
            { first: "Victoria", last: "Contreras", ext: "262", phone: "830-374-3810", fax: "830-374-5933" },
            { first: "Isela", last: "Picazo", ext: "234", phone: "830-374-3105", fax: "830-374-5933" },
            { first: "Ricky", last: "Rios", ext: "236", phone: "830-374-3615", fax: "830-374-5933" }
        ]
    },
    {
        department: "Tax Assessor/Collector",
        contacts: [
            { first: "Rosario \"Chari\"", last: "Benavidez", ext: "251", phone: "830-374-2351", fax: "830-374-5775" },
            { first: "Nicole", last: "Cisneros", ext: "246", phone: "830-374-2351" }
        ]
    },
    {
        department: "Utility Department",
        contacts: [
            { first: "Clemente", last: "De La Cruz", phone: "830-374-2095", fax: "830-374-2895" },
            { first: "Michelle", last: "Pena", phone: "830-374-2095", fax: "830-374-2895" },
            { first: "Anselma", last: "Rocha", phone: "830-374-2095", fax: "830-374-2895" }
        ]
    },
    {
        department: "Veterans Service Office",
        contacts: [
            { first: "Eloy", last: "Vera", phone: "254-220-1201" }
        ]
    }
];