document.addEventListener('DOMContentLoaded', function() {
    const educationStageSelect = document.querySelector('select[name="educationStage"]');
    const secondaryGroupSelect = document.querySelector('select[name="secondaryGroup"]');
    const previousQualificationSelect = document.querySelector('select[name="previousQualification"]');
    const universityProgramSelect = document.querySelector('select[name="universityProgram"]');

    function updateFormVisibility() {
        if (!educationStageSelect) return;
        
        const stage = educationStageSelect.value;

        const setVisible = (name, isVisible) => {
            const input = document.querySelector(`[name="${name}"]`);
            if (input) {
                const group = input.closest('.form-group');
                if (group) {
                    group.style.display = isVisible ? 'block' : 'none';
                    
                    if (isVisible) {
                        input.setAttribute('required', 'required');
                    } else {
                        input.removeAttribute('required');
                    }
                }
            }
        };

        const showParentEmail = (stage === 'Primary' || stage === 'Elementary');
        setVisible('parentEmail', showParentEmail);

        const showSecondary = (stage === 'Secondary');
        setVisible('secondaryGroup', showSecondary);

        const showScienceOptional = showSecondary && secondaryGroupSelect && secondaryGroupSelect.value === 'Science';
        setVisible('scienceOptionalSubject', showScienceOptional);

        const showHSC = (stage === 'Higher Secondary');
        setVisible('hscGroup', showHSC);

        const showUniversity = (stage === 'University');
        setVisible('universityProgram', showUniversity);
        setVisible('previousQualification', showUniversity);
    }

    if (educationStageSelect) {
        educationStageSelect.addEventListener('change', updateFormVisibility);
        updateFormVisibility();
    }

    if (secondaryGroupSelect) {
        secondaryGroupSelect.addEventListener('change', updateFormVisibility);
    }

    const universityPrograms = {
        'Pre-Medical': [
            'MBBS', 'BDS', 'Pharm-D', 'DVM (Veterinary)', 'BS Nursing', 
            'Doctor of Physical Therapy (DPT)', 'BS Medical Lab Technology (MLT)', 
            'BS Psychology', 'BS Public Health', 'BS Human Nutrition & Dietetics',
            'BS Biotechnology', 'BS Microbiology', 'BS Zoology', 'BS Botany', 'BS Chemistry'
        ],
        'Pre-Engineering': [
            'BS Civil Engineering', 'BS Mechanical Engineering', 'BS Electrical Engineering', 
            'BS Chemical Engineering', 'BS Software Engineering', 'BS Computer Engineering', 
            'BS Architecture', 'BS Urban Planning', 'BS Petroleum Engineering', 
            'BS Industrial Engineering', 'BS Mathematics', 'BS Physics', 'BS Aviation Management'
        ],
        'ICS': [
            'BS Computer Science', 'BS Software Engineering', 'BS Information Technology', 
            'BS Data Science', 'BS Artificial Intelligence', 'BS Cyber Security', 
            'BS Bioinformatics', 'BS Telecommunication', 'BS Accounting & Finance', 
            'BS Mathematics', 'BS Statistics', 'BS Physics'
        ],
        'I.Com': [
            'BBA (Hons)', 'BS Accounting & Finance', 'BS Commerce', 'BS Economics', 
            'BS Banking & Finance', 'BS Public Administration', 'BS Human Resource Management (HRM)', 
            'BS Marketing', 'BS Supply Chain Management', 'CA (Chartered Accountancy)', 'ACCA'
        ],
        'FA': [
            'LLB (Law)', 'BS English Literature', 'BS Urdu', 'BS Media Studies', 
            'BS Mass Communication', 'BS Sociology', 'BS Psychology', 'BS Political Science', 
            'BS International Relations', 'BS History', 'BS Education', 'BS Fine Arts', 
            'BS Fashion Design', 'BS Islamic Studies', 'BS Philosophy'
        ]
    };

    function updateUniversityPrograms() {
        if (!previousQualificationSelect || !universityProgramSelect) return;
        
        const group = previousQualificationSelect.value;
        const programs = universityPrograms[group] || [];
        
        universityProgramSelect.innerHTML = '<option value="">Select Program</option>';
        
        programs.forEach(prog => {
            const option = document.createElement('option');
            option.value = prog;
            option.textContent = prog;
            universityProgramSelect.appendChild(option);
        });
    }

    if (previousQualificationSelect) {
        previousQualificationSelect.addEventListener('change', updateUniversityPrograms);
    }

    const provinceSelects = document.querySelectorAll('select[name="province"]');

    const citiesByProvince = {
        'Punjab': ['Ahmadpur Sial', 'Ahmedpur East', 'Alipur Chatha', 'Arifwala', 'Attock Tehsil', 'Baddomalhi', 'Bahawalnagar', 'Bahawalpur', 'Bakhri Ahmad Khan', 'Basirpur', 'Basti Dosa', 'Begowala', 'Bhakkar', 'Bhalwal', 'Bhawana', 'Bhera', 'Bhopalwala', 'Burewala', 'Chak Azam Saffo', 'Chak Jhumra', 'Chak One Hundred Twenty Nine Left', 'Chak Thirty-one -Eleven Left', 'Chak Two Hundred Forty-Nine TDA', 'Chakwal', 'Chawinda', 'Chichawatni', 'Chiniot', 'Chishtian', 'Choa Saidanshah', 'Chuhar Kana', 'Chunian', 'Daira Din Panah', 'Dajal', 'Dandot RS', 'Darya Khan', 'Daska', 'Daud Khel', 'Daultala', 'Dera Ghazi Khan', 'Dhanot', 'Dhaunkal', 'Dhok Awan', 'Dijkot', 'Dinan Bashnoian Wala', 'Dinga', 'Dipalpur', 'Dullewala', 'Dunga Bunga', 'Dunyapur', 'Eminabad', 'Faisalabad', 'Faqirwali', 'Faruka', 'Fazilpur', 'Ferozewala', 'Fort Abbas', 'Garh Maharaja', 'Gojra', 'Gujar Khan', 'Gujranwala', 'Gujranwala Division', 'Gujrat', 'Hadali', 'Hafizabad', 'Harnoli', 'Harunabad', 'Hasan Abdal', 'Hasilpur', 'Haveli Lakha', 'Hazro', 'Hujra Shah Muqeem', 'Jahanian Shah', 'Jalalpur Jattan', 'Jalalpur Pirwala', 'Jampur', 'Jand', 'Jandiala Sher Khan', 'Jaranwala', 'Jatoi Shimali', 'Jauharabad', 'Jhang', 'Jhang Sadar', 'Jhawarian', 'Jhelum', 'Kabirwala', 'Kahna Nau', 'Kahuta', 'Kalabagh', 'Kalaswala', 'Kaleke Mandi', 'Kallar Kahar', 'Kalur Kot', 'Kamalia', 'Kamar Mushani', 'Kamoke', 'Kamra', 'Kanganpur', 'Karor', 'Kasur', 'Keshupur', 'Khairpur Tamiwali', 'Khandowa', 'Khanewal', 'Khanga Dogran', 'Khangarh', 'Khanpur', 'Kharian', 'Khewra', 'Khurrianwala', 'Khushab', 'Kohror Pakka', 'Kot Addu Tehsil', 'Kot Ghulam Muhammad', 'Kot Mumin', 'Kot Radha Kishan', 'Kot Rajkour', 'Kot Samaba', 'Kot Sultan', 'Kotli Loharan', 'Kundian', 'Kunjah', 'Ladhewala Waraich', 'Lahore', 'Lala Musa', 'Lalian', 'Layyah', 'Layyah District', 'Liliani', 'Lodhran', 'Mailsi', 'Malakwal', 'Malakwal City', 'Mamu Kanjan', 'Mananwala', 'Mandi Bahauddin', 'Mandi Bahauddin District', 'Mangla', 'Mankera', 'Mehmand Chak', 'Mian Channun', 'Mianke Mor', 'Mianwali', 'Minchinabad', 'Mitha Tiwana', 'Moza Shahwala', 'Multan', 'Multan District', 'Muridke', 'Murree', 'Mustafabad', 'Muzaffargarh', 'Nankana Sahib', 'Narang Mandi', 'Narowal', 'Naushahra Virkan', 'Nazir Town', 'Okara', 'Pakki Shagwanwali', 'Pakpattan', 'Pasrur', 'Pattoki', 'Phalia', 'Pind Dadan Khan', 'Pindi Bhattian', 'Pindi Gheb', 'Pir Mahal', 'Qadirpur Ran', 'Qila Didar Singh', 'Rabwah', 'Rahim Yar Khan', 'Rahimyar Khan District', 'Raiwind', 'Raja Jang', 'Rajanpur', 'Rasulnagar', 'Rawalpindi', 'Rawalpindi District', 'Renala Khurd', 'Rojhan', 'Sadiqabad', 'Sahiwal', 'Sambrial', 'Sangla Hill', 'Sanjwal', 'Sarai Alamgir', 'Sarai Sidhu', 'Sargodha', 'Shahkot Tehsil', 'Shahpur', 'Shahr Sultan', 'Shakargarh', 'Sharqpur', 'Sheikhupura', 'Shorkot', 'Shujaabad', 'Sialkot', 'Sillanwali', 'Sodhra', 'Sukheke Mandi', 'Surkhpur', 'Talagang', 'Talamba', 'Tandlianwala', 'Taunsa', 'Toba Tek Singh', 'Umerkot', 'Vihari', 'Wah', 'Warburton', 'Wazirabad', 'West Punjab', 'Yazman', 'Zafarwal', 'Zahir Pir'],
        'Sindh': ['Adilpur', 'Badin', 'Bagarji', 'Bandhi', 'Berani', 'Bhan', 'Bhiria', 'Bhit Shah', 'Bozdar Wada', 'Bulri', 'Chak', 'Chamber', 'Chhor', 'Chuhar Jamali', 'Dadu', 'Daromehar', 'Darya Khan Marri', 'Daulatpur', 'Daur', 'Dhoro Naro', 'Digri', 'Diplo', 'Dokri', 'Gambat', 'Garhiyasin', 'Gharo', 'Ghauspur', 'Ghotki', 'Goth Garelo', 'Goth Phulji', 'Goth Radhan', 'Hala', 'Hingorja', 'Hyderabad', 'Islamkot', 'Jacobabad', 'Jām Sāhib', 'Jamshoro', 'Jati', 'Jhol', 'Johi', 'Kadhan', 'Kambar', 'Kandhkot', 'Kandiari', 'Kandiaro', 'Karachi', 'Karaundi', 'Kario Ghanwar', 'Kashmor', 'Keti Bandar', 'Khadro', 'Khairpur', 'Khairpur Mir’s', 'Khairpur Nathan Shah', 'Khanpur Mahar', 'Kot Diji', 'Kotri', 'Kunri', 'Lakhi', 'Larkana', 'Madeji', 'Malir Cantonment', 'Matiari', 'Matli', 'Mehar', 'Miro Khan', 'Mirpur Bhtoro', 'Mirpur Khas', 'Mirpur Mathelo', 'Mirpur Sakro', 'Mirwah Gorchani', 'Mithi', 'Moro', 'Nabisar', 'Nasirabad', 'Naudero', 'Naukot', 'Naushahro Firoz', 'Nawabshah', 'New Bādāh', 'Pad Idan', 'Pano Aqil', 'Pir Jo Goth', 'Pithoro', 'Rajo Khanani', 'Ranipur', 'Ratodero', 'Rohri', 'Rustam', 'Sakrand', 'Samaro', 'Sanghar', 'Sann', 'Sehwan', 'Setharja Old', 'Shahdad Kot', 'Shahdadpur', 'Shahpur Chakar', 'Shikarpur', 'Sinjhoro', 'Sīta Road', 'Sobhodero', 'Sukkur', 'Talhar', 'Tando Adam', 'Tando Allahyar', 'Tando Bago', 'Tando Jam', 'Tando Mitha Khan', 'Tando Muhammad Khan', 'Tangwani', 'Tharu Shah', 'Thatta', 'Thul', 'Ubauro', 'Umarkot', 'Umerkot District', 'Warah'],
        'Balochistan': ['Alik Ghund', 'Awārān District', 'Barkhan', 'Bārkhān District', 'Bela', 'Bhag', 'Chāgai District', 'Chaman', 'Chowki Jamali', 'Dadhar', 'Dalbandin', 'Dera Bugti', 'Dera Bugti District', 'Duki', 'Gadani', 'Garhi Khairo', 'Gwadar', 'Harnai', 'Jāfarābād District', 'Jhal Magsi District', 'Jiwani', 'Kalat', 'Kalāt District', 'Khadan Khak', 'Kharan', 'Khārān District', 'Khuzdar', 'Khuzdār District', 'Kohlu', 'Kot Malik Barkhurdar', 'Lasbela District', 'Loralai', 'Loralai District', 'Mach', 'Mastung', 'Mastung District', 'Mehrabpur', 'Mūsa Khel District', 'Nasīrābād District', 'Nushki', 'Ormara', 'Panjgūr District', 'Pasni', 'Pishin', 'Qila Saifullāh District', 'Quetta', 'Quetta District', 'Sibi', 'Sohbatpur', 'Surab', 'Turbat', 'Usta Muhammad', 'Uthal', 'Zhob', 'Zhob District', 'Ziarat', 'Ziārat District'],
        'Khyber Pakhtunkhwa': ['Abbottabad', 'Akora', 'Aman Garh', 'Amirabad', 'Ashanagro Koto', 'Baffa', 'Bannu', 'Bat Khela', 'Battagram', 'Battagram District', 'Buner District', 'Charsadda', 'Cherat Cantonement', 'Chitral', 'Dera Ismail Khan', 'Dera Ismāīl Khān District', 'Doaba', 'Hangu', 'Haripur', 'Havelian', 'Kakad Wari Dir Upper', 'Karak', 'Khalabat', 'Kohat', 'Kulachi', 'Lachi', 'Lakki', 'Mansehra', 'Mardan', 'Mingora', 'Noorabad', 'Nowshera', 'Nowshera Cantonment', 'Pabbi', 'Paharpur', 'Peshawar', 'Risalpur Cantonment', 'Sarai Naurang', 'Shabqadar', 'Shingli Bala', 'Shorkot', 'Swabi', 'Tangi', 'Tank', 'Thal', 'Topi', 'Upper Dir', 'Utmanzai', 'Zaida']
    };

    function updateCities(event) {
        const provinceSelect = event.target;
        const form = provinceSelect.closest('form') || document;
        const citySelect = form.querySelector('select[name="city"]');

        if (!citySelect) return;

        const selectedProvince = provinceSelect.value;
        const cities = citiesByProvince[selectedProvince] || [];
        
        citySelect.innerHTML = '<option value="">Select City</option>';
        
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }

    provinceSelects.forEach(select => {
        select.addEventListener('change', updateCities);
    });
});