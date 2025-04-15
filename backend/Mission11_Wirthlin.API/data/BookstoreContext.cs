using Microsoft.EntityFrameworkCore;
using Mission11_Wirthlin.API.Models;

namespace Mission11_Wirthlin.API.Data
{
    public class BookstoreContext : DbContext
    {
        public BookstoreContext(DbContextOptions<BookstoreContext> options)
            : base(options)
        {
        }

        public DbSet<Book> Books { get; set; } = null!;
    }
}
