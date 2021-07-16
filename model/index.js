const fs = require('fs/promises')
const path = require('path')
const contactsPath = path.join(__dirname, './contacts.json')
const { v4: uuidv4 } = require('uuid')

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, 'utf8')
  return JSON.parse(data)
}

const getContactById = async (contactId) => {
  const contacts = await listContacts()
  const contact = contacts.find(({ id }) => id.toString() === contactId)
  return contact
}

const removeContact = async (contactId) => {
  const contacts = await listContacts()
  const contact = contacts.find(({ id }) => id.toString() === contactId)
  if (!contact) return
  const newContacts = contacts.filter(({ id }) => id.toString() !== contactId)
  await fs.writeFile(
    contactsPath,
    JSON.stringify(newContacts, null, 2),
    'utf8',
  )
  return contact
}

const addContact = async (body) => {
  const contacts = await listContacts()
  const newContact = { id: uuidv4(), ...body }
  const newContacts = [...contacts, newContact]
  await fs.writeFile(
    contactsPath,
    JSON.stringify(newContacts, null, 2),
    'utf8'
  )
  return newContact
}

const updateContact = async (contactId, body) => {
  const contacts = await listContacts()
  const idx = contacts.findIndex(({ id }) => id.toString() === contactId)
  if (idx === -1) return
  contacts[idx] = { ...contacts[idx], ...body }
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), 'utf8')
  return contacts[idx]
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
