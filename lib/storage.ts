interface Contact {
  name: string
  email: string
  phone: string
  timestamp: string
}

class ContactStorage {
  private static instance: ContactStorage
  private contacts: Contact[] = []

  private constructor() {}

  static getInstance(): ContactStorage {
    if (!ContactStorage.instance) {
      ContactStorage.instance = new ContactStorage()
    }
    return ContactStorage.instance
  }

  addContact(contact: Contact): void {
    this.contacts.push(contact)
  }

  getContacts(): Contact[] {
    return this.contacts
  }

  clearContacts(): void {
    this.contacts = []
  }
}

export const contactStorage = ContactStorage.getInstance()
