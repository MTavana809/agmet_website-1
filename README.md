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
<br>
27/07/2023 <br>

During the meeting attended by Mike, Keith, Dave, and Doug, a notable issue concerning the accuracy of day indicators' data was discussed. The day indicators displayed a lack of data, presenting a value of 0. This inconsistency led to misunderstandings when interpreting the associated maps.

To address this concern, a decision was reached during the meeting. It was agreed that replacing the 0 value with the maximum possible value would enhance the clarity and comprehension of the map readings. However, implementing this solution requires a series of steps involving the manipulation of data files and geospatial tools.

Resolution Steps:

Data Revaluation: To rectify the issue, it will be necessary to revisit the raster data files. These files need to be recalculated to replace 0 with the maximum allowable value.

Recreation of Multidimensional Mosaics: Following the rasters revaluation, the next step involves the recreation of the multidimensional mosaics in the GIS environment. 

GIS Service Upload: The updated mosaics need to be uploaded to the GIS Service. 

Integration with JavaScript: Finally, the corrected mosaics will be incorporated into JavaScript applications for visualization and interaction purposes. 

Conclusion:

The decision to address the issue of 0 values in day indicators by replacing them with the maximum value was agreed upon during the meeting. The resolution process involves revisiting the data files, recalculating the values, recreating mosaics, uploading them to the GIS Service, and integrating them with JavaScript applications. This comprehensive approach ensures that the corrected data will be accurately represented and interpreted, leading to improved map readings and a better understanding of the underlying spatial information.

I used python to replace 0 with max value:

```
import os
import rasterio

def replace_zero_with_max_value(input_file, output_file):
    with rasterio.open(input_file) as src:
        data = src.read(1)  # Read the first band of the raster
        max_value = data.max()  # Find the maximum value in the raster

        # Replace 0 values with the maximum value
        data[data == 0] = 366

        # Copy the raster metadata to the output file
        profile = src.profile

    # Write the modified data to the output file
    with rasterio.open(output_file, 'w', **profile) as dst:
        dst.write(data, 1)

# Specify the folder where your raster files are located
input_folder = 'B:/indicators/ZERO TO MAX' 

# Get a list of all TIFF files in the folder
tif_files = [f for f in os.listdir(input_folder) if f.endswith('.tiff')]

# Process each TIFF file in the folder
for tif_file in tif_files:
    input_file = os.path.join(input_folder, tif_file)
    output_file = os.path.join(input_folder, tif_file.replace('.tiff', '.tiff'))
    replace_zero_with_max_value(input_file, output_file)
```
18/08/2023

All the new ensembles uploaded to website and all avg maps replaced. it is ready to use.
