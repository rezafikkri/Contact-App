const { existsSync } = require('fs');
const { mkdir, writeFile, readFile, access } = require('fs/promises');
const chalk = require('chalk');
const validator = require('validator');

async function loadContacts()
{
    const contactsOld = await readFile('./data/contacts.json', { encoding: 'utf8' });
    return JSON.parse(contactsOld);
}

async function saveContact(nama, noHP, email)
{
    // if data directory not exist
    const dirPath = './data';
    if (!existsSync(dirPath)) {
        await mkdir(dirPath);
    }

    // if file contacts not exist
    const dataPath = './data/contacts.json';
    if (!existsSync(dataPath)) {
        await writeFile(dataPath, '[]');
    }

    const contactNew = { nama, noHP, email };
    const contactsOld = await loadContacts();

    // if ducplicate name
    if (contactsOld.find(contact => contact.nama == nama)) {
        console.log(chalk.red.inverse.bold('Contact sudah terdaftar, gunakan nama lain!'));
        return false;
    }
    // if email exist and invalid
    if (email != undefined && !validator.isEmail(email)) {
        console.log(chalk.red.inverse.bold('Email tidak valid!'));
        return false;
    }
    // if noHP invalid
    if (!validator.isMobilePhone(noHP, 'id-ID')) {
        console.log(chalk.red.inverse.bold('Nomor Handphone tidak valid!'));
        return false;
    }

    contactsOld.push(contactNew);

    await writeFile('./data/contacts.json', JSON.stringify(contactsOld));
    console.log(chalk.green.inverse.bold('Terimakasih sudah memasukkan data'));
}

async function listContacts()
{
    const contacts = await loadContacts();
    console.log(chalk.cyan.inverse.bold('Daftar contact : '));
    contacts.forEach((contact, i) => {
        console.log(`${i + 1}. ${contact.nama} - ${contact.noHP}`);
    });
}

async function detailContact(nama)
{
    const contacts = await loadContacts();
    const contact = contacts.find(contact => contact.nama.toLowerCase() == nama.toLowerCase());

    if (!contact) {
        console.log(chalk.red.inverse.bold(`Data contact ${nama} tidak ditemukan`));
        return false;
    }

    console.log(chalk.cyan.inverse.bold(contact.nama));
    console.log(contact.noHP);
    if (contact.email) {
        console.log(contact.email);
    }
}

async function deleteContact(nama)
{ 
    const contacts = await loadContacts();
    const index = contacts.findIndex(contact => contact.nama.toLowerCase() == nama.toLowerCase());
    if (index == -1) {
        console.log(chalk.red.inverse.bold(`Data contact ${nama} tidak ditemukan`));
        return false;
    }
    
    contacts.splice(index, 1);
    await writeFile('./data/contacts.json', JSON.stringify(contacts));
    console.log(chalk.green.inverse.bold(`Data contact ${nama} berhasil dihapus`));
}

module.exports = {
    saveContact,
    listContacts,
    detailContact,
    deleteContact
};
