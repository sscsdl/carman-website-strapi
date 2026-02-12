ps aux|grep "carman-website-strapi/cms"|grep -v grep|awk '{print $2}'|xargs kill -9
