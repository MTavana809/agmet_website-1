# agmet_website
 website for displaying agrometeological indicators 

The website has recently undergone significant enhancements to its multidimensional mosaic dataset, which presents a comprehensive view of multiple agrometeorological indicators in the UK. The dataset includes observations from the years 1961 to 2020, as well as ensemble mean projections spanning from 2021 to 2080.

In the latest update, 12 new ensembles have been added to the website. These additions have been made to highlight the differences between each ensemble, thus providing a more nuanced and detailed maps of the data. 
Additionally, the colour ramp for some of the indicators has been changed, which further enhances the clarity of the dataset.

To improve the user experience, an explanation for each indicator has been added to the hide side average maps. This feature will help users better understand the meaning and significance of each indicator and enable them to make more informed interpretations of the data.

22/06/2023 <br/>
I have identified an issue related to the display of ensembles in JavaScript. The current algorithm being utilized for the display is the max-min method. However, a problem arises as the calculations are performed individually for each ensemble, resulting in varying ranges. In order to effectively compare the ensembles, it is imperative to establish a consistent range for displaying.
<br/>

10/07/2023 <br>
Finally, I have found a solution to the range problem. Firstly, I added statistics to the renderer function and set the maximum and minimum values for each indicator separately. However, upon adding the statistics, I encountered difficulties with loading and displaying some indicators. After thoroughly checking everything, I discovered that the issue lay in the colorRamp algorithm. Ultimately, I found the most suitable algorithm for blending colors (hsv).

The next step involves calculating the maximum and minimum values for each indicator in Python.

12/07/2023 <br>

The python code for calculating max-min:
```
# for tiff files

import rasterio
import numpy as np
import glob

# Set the path to your raster files
raster_files_path = 'path to the folder/*.tiff'

# Create an empty list to store the max and min values
max_values = []
min_values = []

# Iterate over all raster files
for file_path in glob.glob(raster_files_path):
    # Open the raster file
    with rasterio.open(file_path) as dataset:
        # Read the raster data as a NumPy array
        raster_array = dataset.read(1)
        
        # Exclude -9999 values from the array
        raster_array = np.ma.masked_equal(raster_array, -9999)
        
        # Check if the array is not empty
        if raster_array.size > 0:
            # Find the maximum and minimum values in the array
            max_value = np.max(raster_array)
            min_value = np.min(raster_array)
            
            # Append the max and min values to the respective lists
            max_values.append(max_value)
            min_values.append(min_value)

# Check if the lists are not empty
if max_values and min_values:
    # Find the overall maximum and minimum values from the lists
    global_max = np.max(max_values)
    global_min = np.min(min_values)

    # Print the results
    print("Global Maximum Value:", global_max)
    print("Global Minimum Value:", global_min)
else:
    print("No valid raster data found.")
```
