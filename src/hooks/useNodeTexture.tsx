import { useTexture } from "@react-three/drei";

// mapping node type to filename
const nodeTypeToName = (type: number) => {
  switch (type) {
    case 3:
      return "Cou";
    case 4:
      return "Dc";
    case 7:
      return "SSkn";
    case 2:
      return "Tda";
    case 5:
      return "Dia";
    case 0:
      return "Lda";
    default:
      return "MULTI";
  }
};

const useNodeTexture = (nodeType: number) => {
  const typeName = nodeTypeToName(nodeType);

  const normal = `/sprites/nodes/${typeName}.png`;
  const active = `/sprites/nodes/${typeName}_active.png`;
  const viewed = `/sprites/nodes/${typeName}_viewed.png`;
  const gold = `/sprites/nodes/${typeName}_gold.png`;

  return {
    activeTexture: useTexture(active),
    normalTexture: useTexture(normal),
    viewedTexture: useTexture(viewed),
    goldTexture: useTexture(gold),
  };
};

export default useNodeTexture;
