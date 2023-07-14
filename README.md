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
