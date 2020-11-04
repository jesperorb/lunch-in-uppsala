const url = "https://api.github.com/graphql";
const Authorization = "Bearer much secret here";

const buildQuery = () => {
  return `{
    repository(owner: "jesperorb", name: "uppsala-restaurants"){
      object(expression: "master:uppsala-restaurants.json"){
        ... on Blob {
          text
        }
      }
    }
  }`;
};

export const getAll = async () => {
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization },
    body: JSON.stringify({
      query: buildQuery()
    })
  });
  const {
    data: { repository }
  } = await response.json();
  const { food } = JSON.parse(repository.object.text);
  return food;
};
