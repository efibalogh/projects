import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;

public class FileManager {
    private ArrayList <Shape> shapes = new ArrayList<>();

    public FileManager() {}

    public FileManager(ArrayList <Shape> shapes) {
        this.shapes = shapes;
    }

    public ArrayList<Shape> load() {
        JFileChooser fileChooser = new JFileChooser("drawings");
        int result = fileChooser.showOpenDialog(null);

        if (result == JFileChooser.APPROVE_OPTION) {
            File file = fileChooser.getSelectedFile();

            try {
                String jsonShapes = Files.readString(Paths.get(file.getPath()));
                parseJson(jsonShapes);
                System.err.println("Loaded from " + file.getAbsolutePath());
            } catch (IOException e) {
                System.err.println("Error loading from " + file.getAbsolutePath());
            }
        }

        return shapes;
    }

    public void save() {
        JFileChooser fileChooser = new JFileChooser("drawings");
        int result = fileChooser.showSaveDialog(null);

        if (result == JFileChooser.APPROVE_OPTION) {
            File file = fileChooser.getSelectedFile();
            String path = file.getAbsolutePath();

            if (!path.endsWith(".json")) {
                path += ".json";
            }

            try {
                FileWriter writer = new FileWriter(path);
                writer.write(convertShapesToJson());
                writer.close();
                System.err.println("Saved to " + path);
            } catch (IOException e) {
                System.err.println("Error saving to " + path);
            }
        }
    }

    private void parseJson(String json) {
        json = json.substring(1, json.length() - 1);
        StringBuilder shapeBuilder = new StringBuilder();
        ArrayList <String> shapeStrings = new ArrayList<>();
        boolean inShape = false;
        int openBrackets = 0;

        for (char c : json.toCharArray()) {
            if (c == '{') {
                openBrackets++;
                inShape = true;
            } else if (c == '}') {
                openBrackets--;
                if (openBrackets == 0) {
                    inShape = false;
                    shapeStrings.add(shapeBuilder.toString());
                    shapeBuilder = new StringBuilder();
                }
            }

            if (inShape) {
                shapeBuilder.append(c);
            }
        }

        for (String shapeString : shapeStrings) {
            String[] properties = shapeString.split(",");
            String type = properties[0].split(":")[1].replace("\"", "").trim();
            int thickness = Integer.parseInt(properties[1].split(":")[1].trim());
            int r = Integer.parseInt(properties[2].split(":")[2].trim());
            int g = Integer.parseInt(properties[3].split(":")[1].trim());
            int b = Integer.parseInt(properties[4].split(":")[1].split("}")[0].trim());
            Color colour = new Color(r, g, b);

            switch (type) {
                case "Line" -> {
                    int x1 = Integer.parseInt(properties[5].split(":")[1].trim());
                    int y1 = Integer.parseInt(properties[6].split(":")[1].trim());
                    int x2 = Integer.parseInt(properties[7].split(":")[1].trim());
                    int y2 = Integer.parseInt(properties[8].split(":")[1].split("}")[0].trim());
                    shapes.add(new Line(x1, y1, x2, y2, thickness, colour));
                }
                case "Circle" -> {
                    int centerX = Integer.parseInt(properties[5].split(":")[1].trim());
                    int centerY = Integer.parseInt(properties[6].split(":")[1].trim());
                    int radius = Integer.parseInt(properties[7].split(":")[1].split("}")[0].trim());
                    shapes.add(new Circle(centerX, centerY, radius, thickness, colour));
                }
                case "Rectangle" -> {
                    int x1 = Integer.parseInt(properties[5].split(":")[1].trim());
                    int y1 = Integer.parseInt(properties[6].split(":")[1].trim());
                    int x2 = Integer.parseInt(properties[7].split(":")[1].trim());
                    int y2 = Integer.parseInt(properties[8].split(":")[1].split("}")[0].trim());
                    shapes.add(new Rectangle(x1, y1, x2, y2, thickness, colour));
                }
                case "Polygon" -> {
                    boolean filled = Boolean.parseBoolean(properties[5].split(":")[1].trim());
                    String imagePath = null;
                    BufferedImage image = null;
                    Color fillColour = null;
                    int edgesStart = 6;

                    if (filled) {
                        if (properties[6].contains("fillImage")) {
                            imagePath = properties[6].split(":")[1].replace("\"", "").trim();
                            try {
                                image = ImageIO.read(new File(imagePath));
                            } catch (IOException e) {
                                System.err.println("Image not found: " + imagePath);
                            }
                            edgesStart++;
                        } else {
                            int fillR = Integer.parseInt(properties[6].split(":")[2].trim());
                            int fillG = Integer.parseInt(properties[7].split(":")[1].trim());
                            int fillB = Integer.parseInt(properties[8].split(":")[1].split("}")[0].trim());
                            fillColour = new Color(fillR, fillG, fillB);
                            edgesStart += 3;
                        }
                    }

                    ArrayList <Line> edges = new ArrayList<>();
                    for (int i = edgesStart; i < properties.length; i++) {
                        if (properties[i].contains("x1")) {
                            int x1;
                            if (i != edgesStart) {
                                x1 = Integer.parseInt(properties[i].split(":")[1].trim());
                            } else {
                                x1 = Integer.parseInt(properties[i].split(":")[2].trim());
                            }
                            int y1 = Integer.parseInt(properties[i + 1].split(":")[1].trim());
                            int x2 = Integer.parseInt(properties[i + 2].split(":")[1].trim());
                            int y2 = Integer.parseInt(properties[i + 3].split(":")[1].split("}")[0].trim());
                            edges.add(new Line(x1, y1, x2, y2, thickness, colour));
                        }
                    }

                    Polygon polygon = new Polygon(edges, thickness, colour, colour);
                    polygon.setFilled(filled);

                    if (filled) {
                        if (properties[6].contains("fillImage")) {
                            polygon.setImageFill(true);
                            polygon.setImage(image, imagePath);
                        } else {
                            polygon.setFillColour(fillColour);
                        }
                    }

                    shapes.add(polygon);
                }
            }
        }
    }

    private String convertShapesToJson() {
        StringBuilder jsonBuilder = new StringBuilder("[\n");

        for (int i = 0; i < shapes.size(); i++) {
            Shape shape = shapes.get(i);
            jsonBuilder.append("{\n");
            jsonBuilder.append("\"type\": \"").append(shape.getClass().getSimpleName()).append("\",\n");
            jsonBuilder.append("\"thickness\": ").append(shape.getThickness()).append(",\n");
            jsonBuilder.append("\"colour\": {\n");
            jsonBuilder.append("\"r\": ").append(shape.getColour().getRed()).append(",\n");
            jsonBuilder.append("\"g\": ").append(shape.getColour().getGreen()).append(",\n");
            jsonBuilder.append("\"b\": ").append(shape.getColour().getBlue()).append("\n}");
            jsonBuilder.append(",\n");

            switch (shape) {
                case Line line -> {
                    jsonBuilder.append("\"x1\": ").append(line.getX1()).append(",\n");
                    jsonBuilder.append("\"y1\": ").append(line.getY1()).append(",\n");
                    jsonBuilder.append("\"x2\": ").append(line.getX2()).append(",\n");
                    jsonBuilder.append("\"y2\": ").append(line.getY2());
                }
                case Circle circle -> {
                    jsonBuilder.append("\"centerX\": ").append(circle.getCenterX()).append(",\n");
                    jsonBuilder.append("\"centerY\": ").append(circle.getCenterY()).append(",\n");
                    jsonBuilder.append("\"radius\": ").append(circle.getRadius());
                }
                case Rectangle rectangle -> {
                    jsonBuilder.append("\"x1\": ").append(rectangle.getX1()).append(",\n");
                    jsonBuilder.append("\"y1\": ").append(rectangle.getY1()).append(",\n");
                    jsonBuilder.append("\"x2\": ").append(rectangle.getX2()).append(",\n");
                    jsonBuilder.append("\"y2\": ").append(rectangle.getY2());
                }
                case Polygon polygon -> {
                    jsonBuilder.append("\"filled\": ").append(polygon.getFilled());

                    if (polygon.getFilled()) {
                        jsonBuilder.append(",\n");
                        if (!polygon.getImageFill()) {
                            jsonBuilder.append("\"fillColour\": {\n");
                            jsonBuilder.append("\"r\": ").append(polygon.getFillColour().getRed()).append(",\n");
                            jsonBuilder.append("\"g\": ").append(polygon.getFillColour().getGreen()).append(",\n");
                            jsonBuilder.append("\"b\": ").append(polygon.getFillColour().getBlue()).append("\n}");
                        } else {
                            jsonBuilder.append("\"fillImage\": \"").append(polygon.getImagePath()).append("\"");
                        }
                    }

                    jsonBuilder.append(",\n\"edges\": [\n");
                    Line[] edges = polygon.getEdges();
                    for (int j = 0; j < edges.length; j++) {
                        Line edge = edges[j];
                        jsonBuilder.append("{\n");
                        jsonBuilder.append("\"x1\": ").append(edge.getX1()).append(",\n");
                        jsonBuilder.append("\"y1\": ").append(edge.getY1()).append(",\n");
                        jsonBuilder.append("\"x2\": ").append(edge.getX2()).append(",\n");
                        jsonBuilder.append("\"y2\": ").append(edge.getY2()).append("\n");
                        jsonBuilder.append("}");
                        if (j < edges.length - 1) {
                            jsonBuilder.append(",");
                        }
                        jsonBuilder.append("\n");
                    }
                    jsonBuilder.append("]");
                }
                default -> {
                }
            }

            jsonBuilder.append("\n}");
            if (i < shapes.size() - 1) {
                jsonBuilder.append(",");
            }
            jsonBuilder.append("\n");
        }

        jsonBuilder.append("]");
        return jsonBuilder.toString();
    }
}