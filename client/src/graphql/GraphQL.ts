const fetchGraphQL = async (text: String, variables: any[]) => {
  const response : Response = await fetch("/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: text,
      variables,
    }),
  });

  if(response.ok)
    return await response.json();

  throw(await response.json());
};

export default fetchGraphQL;
