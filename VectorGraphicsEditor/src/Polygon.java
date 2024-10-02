import java.awt.*;
import java.awt.image.BufferedImage;
import java.util.ArrayList;
import java.util.Comparator;

public class Polygon implements Shape {
    private final ArrayList <Line> edges;
    private final ArrayList <Point> vertices;
    private int thickness;
    private Color colour;
    private boolean filled;
    private Color fillColour;
    private boolean imageFill;
    private BufferedImage fillImage;
    private String imagePath;

    public Polygon(ArrayList <Line> edges, int thickness, Color colour, Color fillColour) {
        this.edges = edges;
        this.vertices = new ArrayList<>();

        for (Line edge : edges) {
            vertices.add(new Point(edge.getX1(), edge.getY1()));
        }

        setThickness(thickness);
        this.colour = colour;
        filled = false;
        this.fillColour = fillColour;
        imageFill = false;
        fillImage = null;
    }

    @Override
    public void draw(Graphics g) {
        for (Line edge : edges) {
            edge.draw(g);
        }

        if (filled) {
            fill(g);
        }
    }

    private static class Edge {
        int yMin;
        int yMax;
        double x;
        double invSlope;

        public Edge(int yMin, int yMax, double x, double invSlope) {
            this.yMin = yMin;
            this.yMax = yMax;
            this.x = x;
            this.invSlope = invSlope;
        }
    }

    private void fill(Graphics g) {
        int yMin = Integer.MAX_VALUE;
        int yMax = Integer.MIN_VALUE;

        for (Point vertex : vertices) {
            yMin = Math.min(yMin, vertex.y);
            yMax = Math.max(yMax, vertex.y);
        }

        ArrayList <Edge> activeEdgeTable = new ArrayList<>();

        for (int y = yMin; y <= yMax; y++) {
            int finalY = y;
            activeEdgeTable.removeIf(edge -> finalY >= edge.yMax);

            for (Line edge : edges) {
                int x1 = edge.getX1();
                int y1 = edge.getY1();
                int x2 = edge.getX2();
                int y2 = edge.getY2();

                if (y1 > y2) {
                    int temp = x1;
                    x1 = x2;
                    x2 = temp;
                    temp = y1;
                    y1 = y2;
                    y2 = temp;
                }

                if (y == y1) {
                    activeEdgeTable.add(new Edge(y1, y2, x1, (double) (x2 - x1) / (y2 - y1)));
                }
            }

            activeEdgeTable.sort(Comparator.comparingDouble(edge -> edge.x));

            for (int i = 0; i < activeEdgeTable.size(); i += 2) {
                int x1 = (int) Math.round(activeEdgeTable.get(i).x);
                int x2 = (int) Math.round(activeEdgeTable.get((i + 1) % activeEdgeTable.size()).x);

                if (imageFill && fillImage != null) {
                    for (int x = x1; x <= x2; x++) {
                        int imgX = Math.max(0, Math.min(x, fillImage.getWidth() - 1));
                        int imgY = Math.max(0, Math.min(y, fillImage.getHeight() - 1));
                        g.setColor(new Color(fillImage.getRGB(imgX, imgY)));
                        g.fillRect(x, y, 1, 1);
                    }
                } else {
                    g.setColor(fillColour);

                    for (int x = x1; x <= x2; x++) {
                        g.fillRect(x, y, 1, 1);
                    }
                }
            }

            for (Edge edge : activeEdgeTable) {
                edge.x += edge.invSlope;
            }
        }
    }

    protected boolean nearPoint(int x, int y) {
        for (Line edge : edges) {
            if (edge.nearPoint(x, y)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public int getThickness() {
        return thickness;
    }

    @Override
    public void setThickness(int thickness) {
        this.thickness = thickness;

        for (Line edge : edges) {
            edge.setThickness(thickness);
        }
    }

    @Override
    public void setColour(Color colour) {
        this.colour = colour;

        for (Line edge : edges) {
            edge.setColour(colour);
        }
    }

    @Override
    public Color getColour() {
        return colour;
    }

    protected void setFillColour(Color fillColour) {
        this.fillColour = fillColour;
    }

    protected Color getFillColour() {
        return fillColour;
    }

    protected Line[] getEdges() {
        return edges.toArray(new Line[0]);
    }

    protected void setEdges(ArrayList <Line> edges) {
        this.edges.clear();
        this.edges.addAll(edges);
    }

    protected void buildEdges() {
        edges.clear();

        for (int i = 0; i < vertices.size(); i++) {
            Point p1 = vertices.get(i);
            Point p2 = vertices.get((i + 1) % vertices.size());
            edges.add(new Line(p1.x, p1.y, p2.x, p2.y, thickness, colour));
        }
    }

    protected ArrayList <Point> getVertices() {
        return vertices;
    }

    protected void setVertices(ArrayList <Point> vertices) {
        this.vertices.clear();
        this.vertices.addAll(vertices);
    }

    protected void setFilled(boolean filled) {
        this.filled = filled;
    }

    protected boolean getFilled() {
        return filled;
    }

    protected void setImageFill(boolean imageFill) {
        this.imageFill = imageFill;
    }

    protected boolean getImageFill() {
        return imageFill;
    }

    protected void setImage(BufferedImage image, String imagePath) {
        this.imageFill = true;
        this.fillImage = image;
        this.imagePath = imagePath;
        System.err.println("Image set: " + imagePath);
    }

    protected BufferedImage getImage() {
        return fillImage;
    }

    protected String getImagePath() {
        return imagePath;
    }

    protected boolean isConvex() {
        int n = edges.size();
        if (n < 3) {
            return false;
        }

        int[] x = new int[n];
        int[] y = new int[n];

        for (int i = 0; i < n; i++) {
            x[i] = edges.get(i).getX1();
            y[i] = edges.get(i).getY1();
        }

        boolean isClockwise = false;
        for (int i = 0; i < n; i++) {
            int x1 = x[i];
            int y1 = y[i];
            int x2 = x[(i + 1) % n];
            int y2 = y[(i + 1) % n];
            int x3 = x[(i + 2) % n];
            int y3 = y[(i + 2) % n];
            int crossProduct = (x2 - x1) * (y3 - y2) - (y2 - y1) * (x3 - x2);

            if (i == 0) {
                isClockwise = crossProduct > 0;
            } else if (isClockwise != crossProduct > 0) {
                return false;
            }
        }
        return true;
    }
}
