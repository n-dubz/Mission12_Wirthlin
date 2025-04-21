using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mission11_Wirthlin.API.Data;      // Or your actual namespace for BookstoreContext
using Mission11_Wirthlin.API.Models;   // Or your actual namespace for Book model
using System.Linq;

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
        public IActionResult Get(
            int pageNumber = 1,
            int pageSize = 10,
            string sortField = "title",
            string sortOrder = "asc",
            string? category = null)
        {
            var query = _context.Books.AsQueryable();

            // Apply category filter if specified
            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(b => b.Category == category);
            }

            // Apply sorting
            query = sortOrder.ToLower() == "desc"
                ? sortField.ToLower() switch
                {
                    "author" => query.OrderByDescending(b => b.Author),
                    "publisher" => query.OrderByDescending(b => b.Publisher),
                    "isbn" => query.OrderByDescending(b => b.ISBN),
                    "classification" => query.OrderByDescending(b => b.Classification),
                    "category" => query.OrderByDescending(b => b.Category),
                    "pagecount" => query.OrderByDescending(b => b.PageCount),
                    "price" => query.OrderByDescending(b => b.Price),
                    _ => query.OrderByDescending(b => b.Title)
                }
                : sortField.ToLower() switch
                {
                    "author" => query.OrderBy(b => b.Author),
                    "publisher" => query.OrderBy(b => b.Publisher),
                    "isbn" => query.OrderBy(b => b.ISBN),
                    "classification" => query.OrderBy(b => b.Classification),
                    "category" => query.OrderBy(b => b.Category),
                    "pagecount" => query.OrderBy(b => b.PageCount),
                    "price" => query.OrderBy(b => b.Price),
                    _ => query.OrderBy(b => b.Title)
                };

            var totalCount = query.Count();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var books = query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(new
            {
                Data = books,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = totalPages
            });
        }

        [HttpGet("categories")]
        public IActionResult GetCategories()
        {
            var categories = _context.Books
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToList();

            return Ok(categories);
        }
    }
}
