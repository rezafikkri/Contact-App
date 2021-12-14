const yargs = require('yargs');
const { saveContact, listContacts, detailContact, deleteContact } = require('./contacts');

yargs.command([
    {
        command: 'add',
        describe: 'Menambahkan contact baru',
        builder: {
            nama: {
                demandOption: true,
                describe: 'Nama Lengkap',
                type: 'string'
            },
            email: {
                demandOption: false,
                describe: 'Email',
                type: 'string'
            },
            noHP: {
                demandOption: true,
                describe: 'Nomor Handphone',
                type: 'string'
            }
        },
        handler(argv) {
            saveContact(argv.nama, argv.noHP, argv.email);
        }
    },
    {
        command: 'list',
        describe: 'Menampilkan semua nama & nomor hp contact',
        handler: async () => await listContacts()
    },
    {
        command: 'detail',
        describe: 'Menampilkan detail sebuah contact',
        builder: {
            nama: {
                demandOption: true,
                describe: 'Nama Lengkap',
                type: 'string'
            }
        },
        handler: async (argv) => await detailContact(argv.nama)
    },
    {
        command: 'delete',
        describe: 'Menghapus sebuah contact berdasarkan nama',
        builder: {
            nama: {
                demandOption: true,
                describe: 'Nama Lengkap',
                type: 'string'
            }
        },
        handler: async (argv) => await deleteContact(argv.nama)
    }
]).demandCommand();

yargs.parse();
