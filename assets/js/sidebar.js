
// $(window).on('load', function() {
//     // $('#editableTable').DataTable();
//     new DataTable('#editableTable', {
//         language: {
//             search: '_INPUT_',
//             searchPlaceholder: 'Search...'
//         }
//     });
// });

        
      // Edit button click event
  //     $(document).on('click', '.edit', function() {
  //         var originalContent = [];
  //         $(this).parent().siblings('td.data').each(function() {
  //             var content = $(this).html();
  //             originalContent.push(content);
  //             $(this).html('<input value="' + content + '" />');
  //         });
  
  //         $(this).siblings('.save').show();
  //         $(this).siblings('.delete').hide();
  //         $(this).hide();
  //         // Show the cancel button
  //         $(this).siblings('.cancel').show();
  //         // Store original content in data attribute
  //         $(this).data('original-content', originalContent);
  //     });
  
  //     // Cancel button click event
  //     $(document).on('click', '.cancel', function() {
  //         // Retrieve the original content from the data attribute
  //         var originalContent = $(this).siblings('.edit').data('original-content');
  //         // Restore the original content
  //         $(this).parent().siblings('td.data').each(function(index) {
  //             $(this).html(originalContent[index]);
  //         });
  
  //         $(this).siblings('.edit').show();
  //         $(this).siblings('.delete').show();
  //         $(this).siblings('.save').hide();
  //         $(this).hide();
  //     });
  
  //     // Save button click event
  //     $(document).on('click', '.save', function() {
  //       var $row = $(this).closest('tr');
  //       $row.find('td.data').each(function() {
  //           var content = $(this).find('input').val();
  //           $(this).html(content);
  //       });
  //       $(this).siblings('.edit').show();
  //       $(this).siblings('.delete').show();
  //       $(this).hide();
  //       $(this).siblings('.cancel').hide();
    
  //       // Move the row to the last position in the table
  //       $row.remove();
  //       $('table.data tbody').append($row);
  //   });
  
  //     // Delete button click event
  //     $(document).on('click', '.delete', function() {
  //       var $rowToDelete = $(this).closest('tr'); // Store the row to delete
        
  //       // Show SweetAlert confirmation dialog
  //       Swal.fire({
  //         title: 'Are you sure?',
  //         text: 'You will not be able to recover this row!',
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonColor: '#d33',
  //         cancelButtonColor: '#3085d6',
  //         confirmButtonText: 'Yes, delete it!',
  //         cancelButtonText: 'Cancel'
  //       }).then((result) => {
  //         if (result.isConfirmed) {
  //           // If confirmed, remove the row
  //           $rowToDelete.remove();
  //           Swal.fire('Deleted!', 'The row has been deleted.', 'success');
  //         }
  //       });
  //     });
  
  //    // Add new button click event
  //    $(document).on('click', '.add-row',function() {
      
  //     var $tableBody = $('table.data tbody');
  //     var $firstRow = $tableBody.find('tr:first-child');
  //     var $newRow = $firstRow.clone();

  //     var $lastRow = $tableBody.find('tr:last-child');
  //     var newSerialNumber = parseInt($lastRow.find('td:first-child').text()) + 1;

  //     // Update serial number
  //     $newRow.find('td:first-child').text(newSerialNumber);

  //     // Clear data cells
  //     $newRow.find('td.data, td.division-number, td.section-number').text('');

  //     // Append the new row
  //     $tableBody.prepend($newRow);
  // });
 
$(document).ready(function () {
   // $('.select2').select2(); //initialize 
    //called when key is pressed in textbox
    $(".numberonly").keypress(function (e) {
        alert('')
       //if the letter is not digit then display error and don't type anything
       if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
          //display error message
          $("#errmsg").html("Digits Only").show().fadeOut("slow");
                 return false;
      }
     });
  });
  const showMenu = (headerToggle, navbarId) => {
  const toggleBtn = document.getElementById(headerToggle),
      nav = document.getElementById(navbarId);
  
  // Validate that variables exist
  if (headerToggle && navbarId) {
    toggleBtn.addEventListener("click", () => {
        // Close all other open menus
        const allNavs = document.querySelectorAll(".navbar");
        allNavs.forEach(navItem => {
            if (navItem.id !== navbarId) {
                navItem.classList.remove("show-menu");
            }
        });
  
        // We add the show-menu class to the div tag with the nav__menu class
        nav.classList.toggle("show-menu");
        // change icon
        toggleBtn.classList.toggle("bx-x");
    });
  }
  };
  //showMenu("header-toggle", "navbar");
  
  /*==================== LINK ACTIVE ====================*/
  const linkColor = document.querySelectorAll(".nav__link");
  
  function colorLink() {
  linkColor.forEach((l) => l.classList.remove("active"));
  this.classList.add("active");
  }
  
  linkColor.forEach((l) => l.addEventListener("click", colorLink));
  
  const navDropdown = document.querySelectorAll(".nav__dropdown");
  for (let i = 0; i < navDropdown.length; i++) {
  navDropdown[i].addEventListener("click", () => {
    // Close all other open dropdowns
    const allDropdowns = document.querySelectorAll(".nav__dropdown");
    allDropdowns.forEach(dropItem => {
        if (dropItem !== navDropdown[i]) {
            dropItem.classList.remove("open");
        }
    });
    navDropdown[i].classList.toggle("open");
  });
  
  // Prevent dropdown collapse when clicking on a link inside the dropdown
  const dropdownLinks = navDropdown[i].querySelectorAll('.nav__dropdown-content a');
  dropdownLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.stopPropagation();
    });
  });
  }
  function ToggleOption(element){
    if(element.classList.contains("open")){
        element.classList.remove("open");

    }
    else{
        element.classList.add("open");
    }
}
  // const main = document.querySelector("main");
  // main.addEventListener("mousemove", (e) => {
  // for (let i = 0; i < navDropdown.length; i++) {
  //   navDropdown[i].classList.remove("open");
  // }
  // });
  