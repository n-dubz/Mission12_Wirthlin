using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mission11_Wirthlin.API.Data;      // Or your actual namespace for BookstoreContext
using Mission11_Wirthlin.API.Models;   // Or your actual namespace for Book model

namespace Mission11_Wirthlin.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly BookstoreContext _context;

        public BooksController(BookstoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetBooks(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 5,
            [FromQuery] string sortField = "Title",
            [FromQuery] string sortOrder = "asc")
        {
            // Get total count for pagination
            var totalCount = await _context.Books.CountAsync();
            
            // Create the base query
            var query = _context.Books.AsQueryable();
            
            // Apply sorting
            query = sortField.ToLower() switch
            {
                "title" => sortOrder.ToLower() == "asc" 
                    ? query.OrderBy(b => b.Title) 
                    : query.OrderByDescending(b => b.Title),
                "author" => sortOrder.ToLower() == "asc" 
                    ? query.OrderBy(b => b.Author) 
                    : query.OrderByDescending(b => b.Author),
                "publisher" => sortOrder.ToLower() == "asc" 
                    ? query.OrderBy(b => b.Publisher) 
                    : query.OrderByDescending(b => b.Publisher),
                "isbn" => sortOrder.ToLower() == "asc" 
                    ? query.OrderBy(b => b.ISBN) 
                    : query.OrderByDescending(b => b.ISBN),
                "classification" => sortOrder.ToLower() == "asc" 
                    ? query.OrderBy(b => b.Classification) 
                    : query.OrderByDescending(b => b.Classification),
                "category" => sortOrder.ToLower() == "asc" 
                    ? query.OrderBy(b => b.Category) 
                    : query.OrderByDescending(b => b.Category),
                "pagecount" => sortOrder.ToLower() == "asc" 
                    ? query.OrderBy(b => b.PageCount) 
                    : query.OrderByDescending(b => b.PageCount),
                "price" => sortOrder.ToLower() == "asc" 
                    ? query.OrderBy(b => b.Price) 
                    : query.OrderByDescending(b => b.Price),
                _ => query.OrderBy(b => b.Title) // Default sorting
            };
            
            // Apply pagination
            var books = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            
            // Return the result with pagination metadata
            return Ok(new
            {
                data = books,
                totalCount = totalCount,
                pageNumber = pageNumber,
                pageSize = pageSize,
                totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }
    }
}
