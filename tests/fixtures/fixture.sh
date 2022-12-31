file="fixture"
extensions=("css" "js" "sh" "sh")

for ext in ${extensions[*]} ; do
  echo "$file.${ext}"
done

