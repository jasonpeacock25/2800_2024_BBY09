

$(document).ready(function () {
  // Define region information
  const regions = {
    "Moon": "Experience the unparalleled thrill of lunar travel, where you can walk where" 
    + "only a few have ventured and gaze upon Earth from the moon's surface. As technology advances," 
    + "the moon is set to become the ultimate destination for adventurous travelers seeking a truly" 
    + "out-of-this-world experience. \n\nUnmatched Scenic Beauty: \nSpectacular Views: Witness the" 
    + "breathtaking Earthrise, seeing our home planet rise above the lunar horizon. \nLunar Landscapes: Explore" 
    + "the moon's diverse terrains, from vast plains to towering mountains and deep craters." 
    + "\n\nUnique Activities: \nMoonwalking: Experience the sensation of low gravity as you walk and jump" 
    + "across the lunar surface. \nStargazing: Enjoy crystal-clear views of the cosmos, free from Earth's light" 
    + "pollution. \nLunar Sports: Engage in innovative sports designed for the moon’s unique environment, such as" 
    + "low-gravity soccer. \n\nLuxurious Accommodations: \nFuturistic Resorts: Stay in state-of-the-art lunar resorts with" 
    + "amenities like zero-gravity spas, glass-domed lounges, and fine dining with Earth views. \nEco-Friendly" 
    + "Living: Experience sustainable living with advanced technologies that recycle water and air and generate power." 
    + "\n\nScientific Exploration: \nLunar Missions: Participate in or observe scientific missions, contributing to" 
    + "humanity’s understanding of the moon. \nEducational Tours: Learn about the moon’s geology, the history of lunar" 
    + "exploration, and the future of space travel. \n\nExclusive Experiences: \nPersonal Milestones: Celebrate birthdays" 
    + "or anniversaries in an extraordinary setting. \nSpace Cuisine: Savor gourmet meals crafted by top chefs using ingredients" 
    + "grown in lunar greenhouses. \n\nThe Future of Lunar Tourism: \nThe moon is the next frontier for human exploration" 
    + "and tourism. With ongoing efforts by space agencies and private companies, lunar travel and habitation infrastructure" 
    + "is rapidly developing. Soon, regular flights to the moon, luxurious accommodations, and a wide range of activities will" 
    + "make lunar tourism accessible to many. \n\nConclusion: \nVisiting the moon is more than just a trip; it embodies the" 
    + "spirit of exploration and the pursuit of knowledge. Whether you’re a thrill-seeker, a science enthusiast, or someone" 
    + "looking for a unique getaway, the moon offers an unparalleled adventure that promises to be both educational and exhilarating." 
    + "Embark on the ultimate space adventure and create memories that are truly out of this world.",
    "Mars": "Imagine standing on the surface of Mars, gazing at its vast deserts, ancient river valleys, and towering volcanoes." 
    + "Mars, the Red Planet, is set to become the ultimate destination for space tourism, offering a blend of adventure, exploration," 
    + "and luxury. Advances in space travel technology are making it possible for adventurous travelers to explore Mars' unique landscapes" 
    + "and geological wonders. Visitors can experience the thrill of low-gravity walking, participate in guided tours of ancient Martian" 
    + "sites, and marvel at the spectacular views from towering formations like Olympus Mons and Valles Marineris. Luxurious resorts will" 
    + "provide state-of-the-art accommodations, featuring amenities such as transparent domes for stargazing, Martian spas, and gourmet" 
    + "dining with fresh produce grown in on-site greenhouses. Mars offers an unparalleled opportunity for scientific exploration and" 
    + "education, allowing guests to partake in ongoing research and learn about the planet's history and potential for future human" 
    + "habitation. Whether you're a thrill-seeker, a science enthusiast, or someone looking for a truly unique getaway, Mars promises" 
    + "an extraordinary adventure that combines the mysteries of space with the comforts of modern luxury. Embark on a journey to Mars" 
    + "and create memories that are truly out of this world.",
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
  $('#region').change(function () {
    const selectedRegion = $(this).val();
    const summary = regions[selectedRegion] || 'Select a region to see the summary.';
    $('#region-summary-text').text(summary);
  });
});