

  $(document).ready(function() {
    // Define region information
    const regions = {
      "Moon": "A beautiful, serene place with stunning views of the Earth.",
      "Mars": "A red planet with vast deserts and ancient river valleys.",
      "Jupiter": "The largest planet in our solar system with a massive storm.",
      "Venus": "A planet with a thick atmosphere and extreme temperatures.",
      "Saturn": "Known for its stunning ring system and numerous moons."
    };

    // Function to update the region summary
    function updateRegionSummary(region) {
      const summary = regions[region] || 'Select a region to see the summary.';
      $('#region-summary-text').text(summary);
    }

    // Update region summary when the page loads
    const initialRegion = $('#region').val();
    updateRegionSummary(initialRegion);

    // Update region summary when a region is selected
    $('#region').change(function() {
      const selectedRegion = $(this).val();
      const summary = regions[selectedRegion] || 'Select a region to see the summary.';
      $('#region-summary-text').text(summary);
    });
  });