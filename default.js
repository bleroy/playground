'use strict';

const test_duration = 60000; // 1 minute

const folks = [
    ["Izabella", "Celma"],
    ["Sarmis", "Saulitis"],
    ["Zdenka", "Kozakova"],
    ["Laimonis", "Skujins"],
    ["Danlami", "Talatuwa"],
    ["Tanko", "Laraba"],
    ["Hamidah", "Yakubu"],
    ["Daina", "Dumina"],
    ["Josef", "Cizek"],
    ["Ida", "Klavina"],
    ["Pavel", "Bures"],
    ["Antonin", "Zelinka"],
    ["Suraj", "Nafisa"],
    ["Aytürk", "Qasim"],
    ["Veronika", "Stejskalova"],
    ["Beatrise", "Kruze"],
    ["Reyhan", "Murat"],
    ["Alida", "Zvirbule"],
    ["Matiass", "Polis"],
    ["Marie", "Markova"],
    ["Agrita", "Krieva"],
    ["Matej", "Skorepa"],
    ["Idris", "Ibrahim"],
    ["Alena", "Valentova"],
    ["Irbe", "Kreslina"],
    ["Shantanu", "Bhattacharya"],
    ["Kazimirs", "Roze"],
    ["Devangi", "Pal"],
    ["Irbe", "Ziemele"],
    ["Daniela", "Kanepa"],
    ["Bashir", "Nafisah"],
    ["Teodors", "Skujins"],
    ["Beatrise", "Klavina"],
    ["Ekber", "Sadir"],
    ["Maksims", "Riekstins"],
    ["Ilga", "Zirne"],
    ["Vladimir", "Sima"],
    ["Ivana", "Cervenkova"],
    ["Jaroslava", "Buresova"],
    ["Tomas", "Kohout"],
    ["Alex", "Krejci"],
    ["Sarmis", "Celms"],
    ["Erkin", "Qadir"],
    ["Raimonds", "Turins"],
    ["Nikolajs", "Lusis"],
    ["Laimonis", "Viksna"],
    ["Everita", "Zirne"],
    ["Marta", "Havrankova"],
    ["Parimal", "Kar"],
    ["Rudolf", "Spousta"],
    ["Blanka", "Vejvodova"],
    ["Niks", "Dzenis"],
    ["Rene", "Dolejsi"],
    ["Danladi", "Maigari"]
]; // Generated by CELA fictitious names generator

const domains_to_delete = ['yahoo.com', 'google.com', 'hotmail.com', 'duck.com'];
const domain_to_archive = 'microsoft.com';

const subjects = [
    "PR: Add new great feature",
    "Re: chain email, forward to everyone you know!",
    "Don't forget to submit your expense reports",
    "Can you help me build my app?",
    "Buy our new product!",
    "Pay no attention to the man behind the curtain",
    "You've won a prize!",
    "Your account has been locked",
    "I need your help",
    "You're invited to a party!",
    "I'm sorry, I can't make it",
    "I'm running late",
    "I'm stuck in traffic",
    "What's for lunch?",
    "Read this article!"
]

const pickFrom = array => array[Math.floor(Math.random() * array.length)];

const findParent = (element, className) => {
    if (element.classList.contains(className)) return element;
    if (element.parentElement) return findParent(element.parentElement, className);
    return null;
};

window.document.addEventListener('DOMContentLoaded', () => {
    const start_button = document.getElementById('start-button');
    const email_template = document.getElementById('email-summary-template').querySelector('.email-summary');
    const email_list = document.getElementById('email-list');
    const phase_one_done = document.getElementById('phase-one-done');
    const results_section = document.getElementById('final-results');
    const results_download = document.getElementById('result-file');

    let email_count = 0;
    let test_running = false;
    let transitioning = false;
    let latest_entered_email = null;
    let deleted_right = 0;
    let deleted_wrong = 0;
    let archived_right = 0;
    let archived_wrong = 0;
    let phase = 0;
    let phase_one_results = null;

    let nextEmailDelay = () => Math.floor(Math.random() * email_count < 5 ? 200 : 2000);

    function addEmail() {
        if (!test_running) return;

        console.log('Adding new email');
        const random_person = pickFrom(folks);
        const domain = Math.random() > 0.5 ? pickFrom(domains_to_delete) : domain_to_archive;
        const email_address = `${random_person[0].toLowerCase()}.${random_person[1].toLowerCase()}@${domain}`;
        const email_summary = email_template.cloneNode(true);
        const subject = pickFrom(subjects);
        email_count++;
        email_summary.querySelector('.from').innerText = `${random_person[0]} ${random_person[1]} <${email_address}>`;
        email_summary.querySelector('.subject').innerText = subject;
        email_summary.classList.add('email');
        email_summary.querySelector('button.delete').addEventListener('click', () => {
            const clicked_email_index = [...email_list.childNodes].indexOf(email_summary);
            console.log(`Deleting email ${clicked_email_index}`);
            if (domain === domain_to_archive) {
                deleted_wrong++;
            } else {
                deleted_right++;
            }
            const email_to_remove = phase === 0 ? email_summary : latest_entered_email;
            latest_entered_email = null;
            email_to_remove.classList.remove('show');
            email_to_remove.addEventListener('transitionend', () => email_count--, {once: true});
        });
        email_summary.querySelector('button.archive').addEventListener('click', () => {
            const archived_email_index = [...email_list.childNodes].indexOf(email_summary);
            console.log(`Archiving email ${archived_email_index}`);
            if (domain === domain_to_archive) {
                archived_right++;
            } else {
                archived_wrong++;
            }
            const email_to_archive = phase === 0 ? email_summary : latest_entered_email;
            latest_entered_email = null;
            email_to_archive.classList.remove('show');
            email_to_archive.addEventListener('transitionend', () => email_count--, {once: true});
        });
        email_summary.addEventListener('transitionstart', () => {
            console.log('Transitioning new email in.');
            transitioning = true;
        });
        email_summary.addEventListener('transitionend', () => {
            console.log('Done transitioning new email in.');
            transitioning = false;

            if (!test_running) return;
    
            console.log('Queueing next email');
            setTimeout(addEmail, nextEmailDelay());
        }, {once: true});
        email_list.insertBefore(email_summary, email_list.childNodes[0]);
        
        setTimeout(() => {
            email_list.classList.add('show');
            setTimeout(() => {
                email_summary.classList.add('show');
            }, 350);
        }, 15);
    }

    email_list.addEventListener('mousemove', e => {
        const aimed_at_email = findParent(e.target, 'email-summary');
        if (aimed_at_email === latest_entered_email) return;
        latest_entered_email = aimed_at_email;
        console.log(`Aimed at email ${latest_entered_email.querySelector('.from').innerText}`);
    });

    start_button.addEventListener('click', () => {
        email_list.innerHTML = '';
        email_count = 0;
        document.querySelectorAll('.notification').forEach(notification => notification.style.display = 'none');
        start_button.disabled = true;
        test_running = true;
        console.log('Test starting');
        addEmail();
        setTimeout(() => {
            test_running = false;
            phase++;
            email_list.querySelectorAll('button').forEach(button => button.disabled = true);
            console.log('Test finished');
            if (phase === 1) {
                phase_one_done.style.display = 'block';
                start_button.disabled = false;
                phase_one_results = {
                    deleted_right,
                    deleted_wrong,
                    archived_right,
                    archived_wrong
                };
            }
            else {
                results_section.style.display = 'block';
                results_download.href = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify({
                    phase1: phase_one_results,
                    phase2: {
                        deleted_right,
                        deleted_wrong,
                        archived_right,
                        archived_wrong
                    }
                }, null, 2))}`;
            }
            console.log(`Deleted right: ${deleted_right}`);
            console.log(`Deleted wrong: ${deleted_wrong}`);
            console.log(`Archived right: ${archived_right}`);
            console.log(`Archived wrong: ${archived_wrong}`);
        }, test_duration);
    });
});