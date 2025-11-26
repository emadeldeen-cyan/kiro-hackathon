import { BookService } from './services';
import { InMemoryBookRepository } from './repositories';
import { OpenLibraryClient } from './clients/openlibrary';

async function testBookService() {
  console.log('Testing BookService...\n');

  const bookRepository = new InMemoryBookRepository();
  const openLibraryClient = new OpenLibraryClient();
  const bookService = new BookService(bookRepository, openLibraryClient);

  try {
    // Test 1: Search OpenLibrary
    console.log('Test 1: Search OpenLibrary for "The Lord of the Rings"');
    const searchResults = await bookService.searchOpenLibrary('The Lord of the Rings');
    console.log(`Found ${searchResults.length} results`);
    if (searchResults.length > 0) {
      console.log(`First result: ${searchResults[0].title} by ${searchResults[0].author_name?.[0] || 'Unknown'}`);
      console.log(`OpenLibrary Key: ${searchResults[0].key}\n`);
    }

    // Test 2: Add book from OpenLibrary (first time)
    console.log('Test 2: Add book from OpenLibrary');
    const openLibraryKey = '/works/OL27448W'; // The Lord of the Rings
    const book1 = await bookService.addBookFromOpenLibrary(openLibraryKey);
    console.log(`Added book: ${book1.title} by ${book1.author}`);
    console.log(`Book ID: ${book1.id}`);
    console.log(`OpenLibrary Key: ${book1.openLibraryKey}\n`);

    // Test 3: Add same book again (should return existing)
    console.log('Test 3: Add same book again (should return existing)');
    const book2 = await bookService.addBookFromOpenLibrary(openLibraryKey);
    console.log(`Returned book ID: ${book2.id}`);
    console.log(`Same book? ${book1.id === book2.id}\n`);

    // Test 4: Get book by ID
    console.log('Test 4: Get book by ID');
    const retrievedBook = await bookService.getBook(book1.id);
    console.log(`Retrieved: ${retrievedBook.title}\n`);

    // Test 5: Search local books (empty query)
    console.log('Test 5: Search local books with empty query');
    const allBooks = await bookService.searchLocalBooks('');
    console.log(`Found ${allBooks.length} books in local database\n`);

    // Test 6: Search local books (with query)
    console.log('Test 6: Search local books with query "Lord"');
    const searchedBooks = await bookService.searchLocalBooks('Lord');
    console.log(`Found ${searchedBooks.length} matching books`);
    if (searchedBooks.length > 0) {
      console.log(`First result: ${searchedBooks[0].title}\n`);
    }

    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error instanceof Error ? error.message : error);
  }
}

testBookService();
